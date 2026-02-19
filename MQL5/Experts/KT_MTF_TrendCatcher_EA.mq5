#property copyright "KT MTF TrendCatcher EA"
#property version   "1.30"
#property strict

#include <Trade/Trade.mqh>

input group "General"
input long   InpMagicNumber = 152257;
input double InpFixedLots   = 0.20;
input bool   InpOnePositionPerSymbol = true;
input bool   InpCloseOnOppositeSignal = true;

input group "Signal Filters"
input int    InpEMAPeriod = 200;
input bool   InpRequireArrowAlignmentAllTF = true;
input int    InpArrowLookbackBars = 12; // Bars to scan for an arrow on each timeframe

input group "KT SuperTrend (iCustom)"
input string InpSuperTrendName = "KT_SuperTrend";
input double InpATRMultiplier  = 2.0;
input int    InpATRPeriod      = 10;
input int    InpATRMaxBars     = 5000;
input int    InpShift          = 0;

input group "Trend Catcher (iCustom)"
input string InpTrendCatcherName = "Trend Catcher (with dash)"; // Must match your compiled indicator file name
input bool   InpTrendCatcherUseExplicitInputs = false; // Set true if your indicator requires explicit iCustom params
input string InpTC_TimeFrames = "m5;m10;m15;m20;m30;h1;h2";
input double InpTC_Sensitivity = 4.0;
input int    InpTC_DisplayMode = 0; // 0=Do not display candles or bars, 1=candles, 2=bars
input int    InpTC_TrendChangeCode = 164;
input int    InpTC_TrendDotsCode = 159;
input int    InpTC_ArrowCodeUp = 233;
input int    InpTC_ArrowCodeDown = 234;
input int    InpTC_ArrowsSize = 1;
input double InpTC_ArrowsShift = 0.5;
input color  InpTC_ArrowsColorUp = clrLimeGreen;
input color  InpTC_ArrowsColorDown = clrDarkOrange;
input int    InpTC_ArrowsLimit = 500;
input int    InpTC_AlertsOn = -1;
input bool   InpTC_AlertsMessage = true;
input bool   InpTC_AlertsSound = false;
input bool   InpTC_AlertsEmail = false;
input bool   InpTC_AlertsPush = false;
input int    InpTC_DashDisplay = 0;
input string InpTC_DashUniqueID = "TccDash1";
input int    InpTC_DashBars = 500;
input string InpTC_DashFont = "Arial";
input int    InpTC_DashCorner = 0;
input int    InpTC_DashSentimentWidth = 20;
input int    InpTC_DashFontSize = 11;
input color  InpTC_DashFontColor = clrBlack;
input color  InpTC_DashBackColor = clrGainsboro;
input color  InpTC_DashBorderColor = clrDimGray;
input color  InpTC_DashHeadColor = clrLimeGreen;
input color  InpTC_DashHeadTextColor = clrBlack;
input color  InpTC_DashColorBull = clrLimeGreen;
input color  InpTC_DashColorBear = clrOrangeRed;
input color  InpTC_DashColorMarker = clrRed;
input int    InpTC_DashTransparency = 15;
input int    InpTC_DashXPos = 20;
input int    InpTC_DashYPos = 40;

input int    InpTrendBlueBuffer  = 5; // lineSup (DodgerBlue)
input int    InpTrendPinkBuffer  = 6; // lineRes (SandyBrown / resistance)

input group "Execution"
input int    InpMaxSpreadPoints = 250;
input int    InpSlippagePoints  = 30;

CTrade gTrade;
datetime gLastM5BarTime = 0;

struct TfHandles
{
   ENUM_TIMEFRAMES tf;
   int stHandle;
   int emaHandle;
};

TfHandles gTf[3];
int gTrendCatcherHandle = INVALID_HANDLE;

bool CopySingle(const int handle, const int bufferIndex, const int shift, double &value)
{
   double tmp[1];
   if(CopyBuffer(handle, bufferIndex, shift, 1, tmp) != 1)
      return false;
   value = tmp[0];
   return true;
}

bool HasRecentArrow(const int stHandle, const int bufferIndex, const int lookback)
{
   int bars = MathMax(1, lookback);
   double arr[];
   ArrayResize(arr, bars);
   ArraySetAsSeries(arr, true);

   int copied = CopyBuffer(stHandle, bufferIndex, 1, bars, arr);
   if(copied <= 0)
      return false;

   for(int i = 0; i < copied; ++i)
   {
      if(arr[i] != EMPTY_VALUE && arr[i] > 0.0)
         return true;
   }
   return false;
}

bool NewM5Bar()
{
   datetime t[1];
   if(CopyTime(_Symbol, PERIOD_M5, 0, 1, t) != 1)
      return false;

   if(t[0] == gLastM5BarTime)
      return false;

   gLastM5BarTime = t[0];
   return true;
}

bool IsSpreadOk()
{
   long spread = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD);
   return (spread >= 0 && spread <= InpMaxSpreadPoints);
}

double NormalizePrice(const double price)
{
   return NormalizeDouble(price, (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS));
}

double NormalizeLots(double lots)
{
   double minLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxLot  = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double stepLot = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);

   if(stepLot <= 0.0)
      return lots;

   lots = MathMax(minLot, MathMin(maxLot, lots));
   lots = MathFloor(lots / stepLot) * stepLot;

   int volumeDigits = 2;
   if(stepLot < 1.0)
      volumeDigits = (int)MathRound(-MathLog10(stepLot));

   return NormalizeDouble(lots, volumeDigits);
}

bool FindOpenPosition(ulong &ticket, ENUM_POSITION_TYPE &type)
{
   ticket = 0;
   type = POSITION_TYPE_BUY;

   for(int i = PositionsTotal() - 1; i >= 0; --i)
   {
      ulong t = PositionGetTicket(i);
      if(t == 0 || !PositionSelectByTicket(t))
         continue;

      string sym = PositionGetString(POSITION_SYMBOL);
      long mgc = PositionGetInteger(POSITION_MAGIC);
      if(sym == _Symbol && mgc == InpMagicNumber)
      {
         ticket = t;
         type = (ENUM_POSITION_TYPE)PositionGetInteger(POSITION_TYPE);
         return true;
      }
   }

   return false;
}

int CreateTrendCatcherHandleByName(const string indName)
{
   if(InpTrendCatcherUseExplicitInputs)
   {
      return iCustom(_Symbol, PERIOD_M5, indName,
                     InpTC_TimeFrames,
                     InpTC_Sensitivity,
                     InpTC_DisplayMode,
                     InpTC_TrendChangeCode,
                     InpTC_TrendDotsCode,
                     "",
                     InpTC_ArrowCodeUp,
                     InpTC_ArrowCodeDown,
                     InpTC_ArrowsSize,
                     InpTC_ArrowsShift,
                     InpTC_ArrowsColorUp,
                     InpTC_ArrowsColorDown,
                     InpTC_ArrowsLimit,
                     "",
                     InpTC_AlertsOn,
                     InpTC_AlertsMessage,
                     InpTC_AlertsSound,
                     InpTC_AlertsEmail,
                     InpTC_AlertsPush,
                     "",
                     InpTC_DashDisplay,
                     InpTC_DashUniqueID,
                     InpTC_DashBars,
                     InpTC_DashFont,
                     InpTC_DashCorner,
                     InpTC_DashSentimentWidth,
                     InpTC_DashFontSize,
                     InpTC_DashFontColor,
                     InpTC_DashBackColor,
                     InpTC_DashBorderColor,
                     InpTC_DashHeadColor,
                     InpTC_DashHeadTextColor,
                     InpTC_DashColorBull,
                     InpTC_DashColorBear,
                     InpTC_DashColorMarker,
                     InpTC_DashTransparency,
                     InpTC_DashXPos,
                     InpTC_DashYPos);
   }

   return iCustom(_Symbol, PERIOD_M5, indName);
}

int CreateTrendCatcherHandle()
{
   string namesToTry[] =
   {
      InpTrendCatcherName,
      "Trend Catcher (with dash)",
      "Trend Catcher (with dash) (BTCUSD,Daily)",
      "Trend Catcher",
      "Trend catcher"
   };

   for(int i = 0; i < ArraySize(namesToTry); ++i)
   {
      if(namesToTry[i] == "")
         continue;
      int h = CreateTrendCatcherHandleByName(namesToTry[i]);
      if(h != INVALID_HANDLE)
      {
         Print("Trend Catcher handle created with name: ", namesToTry[i]);
         return h;
      }
      Print("Trend Catcher handle attempt failed for name: ", namesToTry[i], " error=", GetLastError());
   }

   return INVALID_HANDLE;
}

bool BuildTrendState(const int idx, bool &isBull, bool &isBear, bool &hasBuyArrow, bool &hasSellArrow)
{
   isBull = false;
   isBear = false;
   hasBuyArrow = false;
   hasSellArrow = false;

   double close1 = iClose(_Symbol, gTf[idx].tf, 1);
   if(close1 <= 0.0)
      return false;

   double ema1;
   if(!CopySingle(gTf[idx].emaHandle, 0, 1, ema1) || ema1 == EMPTY_VALUE)
      return false;

   double stDir;
   if(!CopySingle(gTf[idx].stHandle, 4, 1, stDir) || stDir == EMPTY_VALUE)
      return false;

   isBull = (close1 > ema1 && stDir > 0.0);
   isBear = (close1 < ema1 && stDir < 0.0);

   hasBuyArrow = HasRecentArrow(gTf[idx].stHandle, 2, InpArrowLookbackBars);
   hasSellArrow = HasRecentArrow(gTf[idx].stHandle, 3, InpArrowLookbackBars);

   return true;
}

bool BuildEntrySignal(bool &buySignal, bool &sellSignal)
{
   buySignal = false;
   sellSignal = false;

   bool bull[3], bear[3], buyArr[3], sellArr[3];

   for(int i = 0; i < 3; ++i)
   {
      if(!BuildTrendState(i, bull[i], bear[i], buyArr[i], sellArr[i]))
         return false;
   }

   bool allBull = bull[0] && bull[1] && bull[2];
   bool allBear = bear[0] && bear[1] && bear[2];

   if(InpRequireArrowAlignmentAllTF)
   {
      bool arrowsBuy = buyArr[0] && buyArr[1] && buyArr[2];
      bool arrowsSell = sellArr[0] && sellArr[1] && sellArr[2];
      buySignal = allBull && arrowsBuy;
      sellSignal = allBear && arrowsSell;
   }
   else
   {
      buySignal = allBull && buyArr[0];
      sellSignal = allBear && sellArr[0];
   }

   if(buySignal && sellSignal)
   {
      buySignal = false;
      sellSignal = false;
      Print("Conflict state detected (both buy and sell). Trade skipped.");
   }

   return true;
}

bool BuildStops(const bool isBuy, double &sl, double &tp)
{
   double blue, pink;
   if(!CopySingle(gTrendCatcherHandle, InpTrendBlueBuffer, 1, blue) || blue == EMPTY_VALUE)
      return false;
   if(!CopySingle(gTrendCatcherHandle, InpTrendPinkBuffer, 1, pink) || pink == EMPTY_VALUE)
      return false;

   if(isBuy)
   {
      sl = blue;
      tp = pink;
   }
   else
   {
      sl = pink;
      tp = blue;
   }

   return (sl > 0.0 && tp > 0.0);
}

bool ValidateStops(const bool isBuy, const double price, double &sl, double &tp)
{
   int stopsLevel = (int)SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL);
   double minDist = stopsLevel * _Point;

   if(isBuy)
   {
      if(sl >= price || tp <= price)
         return false;

      if((price - sl) < minDist)
         sl = price - minDist;
      if((tp - price) < minDist)
         tp = price + minDist;

      sl = NormalizePrice(sl);
      tp = NormalizePrice(tp);
      return (sl < price && tp > price);
   }

   if(sl <= price || tp >= price)
      return false;

   if((sl - price) < minDist)
      sl = price + minDist;
   if((price - tp) < minDist)
      tp = price - minDist;

   sl = NormalizePrice(sl);
   tp = NormalizePrice(tp);
   return (sl > price && tp < price);
}

int OnInit()
{
   gTrade.SetExpertMagicNumber(InpMagicNumber);
   gTrade.SetDeviationInPoints(InpSlippagePoints);

   gTf[0].tf = PERIOD_M5;
   gTf[1].tf = PERIOD_H1;
   gTf[2].tf = PERIOD_D1;

   for(int i = 0; i < 3; ++i)
   {
      gTf[i].stHandle = iCustom(_Symbol, gTf[i].tf, InpSuperTrendName, InpATRMultiplier, InpATRPeriod, InpATRMaxBars, InpShift);
      gTf[i].emaHandle = iMA(_Symbol, gTf[i].tf, InpEMAPeriod, 0, MODE_EMA, PRICE_CLOSE);

      if(gTf[i].stHandle == INVALID_HANDLE || gTf[i].emaHandle == INVALID_HANDLE)
      {
         Print("OnInit failed: handle creation error on TF index ", i,
               " supertrend=", InpSuperTrendName,
               " error=", GetLastError());
         return INIT_FAILED;
      }
   }

   gTrendCatcherHandle = CreateTrendCatcherHandle();
   if(gTrendCatcherHandle == INVALID_HANDLE)
   {
      Print("OnInit failed: Trend Catcher handle could not be created. Check indicator name and inputs.");
      return INIT_FAILED;
   }

   Print("KT_MTF_TrendCatcher_EA initialized successfully on ", _Symbol, " ", EnumToString(_Period));
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   for(int i = 0; i < 3; ++i)
   {
      if(gTf[i].stHandle != INVALID_HANDLE)
         IndicatorRelease(gTf[i].stHandle);
      if(gTf[i].emaHandle != INVALID_HANDLE)
         IndicatorRelease(gTf[i].emaHandle);
   }

   if(gTrendCatcherHandle != INVALID_HANDLE)
      IndicatorRelease(gTrendCatcherHandle);
}

void OnTick()
{
   if(!NewM5Bar())
      return;

   if(!IsSpreadOk())
   {
      Print("Spread filter blocked trade. Spread=", SymbolInfoInteger(_Symbol, SYMBOL_SPREAD));
      return;
   }

   bool buySignal = false;
   bool sellSignal = false;
   if(!BuildEntrySignal(buySignal, sellSignal))
   {
      Print("Signal build failed. Indicators may be missing data.");
      return;
   }

   ulong openTicket;
   ENUM_POSITION_TYPE openType;
   bool hasPosition = FindOpenPosition(openTicket, openType);

   if(hasPosition)
   {
      if(InpCloseOnOppositeSignal)
      {
         if((openType == POSITION_TYPE_BUY && sellSignal) || (openType == POSITION_TYPE_SELL && buySignal))
         {
            if(!gTrade.PositionClose(openTicket))
               Print("Position close failed. Ticket=", openTicket, " ret=", gTrade.ResultRetcode(), " ", gTrade.ResultRetcodeDescription());
            else
               Print("Position closed on opposite signal. Ticket=", openTicket);
         }
      }
      return;
   }

   if(!buySignal && !sellSignal)
      return;

   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   if(ask <= 0.0 || bid <= 0.0)
      return;

   double lots = NormalizeLots(InpFixedLots);
   if(lots <= 0.0)
   {
      Print("Trade blocked: invalid lot size after normalization.");
      return;
   }

   double sl = 0.0;
   double tp = 0.0;

   if(buySignal)
   {
      if(!BuildStops(true, sl, tp))
      {
         Print("Buy blocked: Trend Catcher levels unavailable.");
         return;
      }
      if(!ValidateStops(true, ask, sl, tp))
      {
         Print("Buy blocked: invalid SL/TP map. ask=", ask, " sl=", sl, " tp=", tp);
         return;
      }

      if(!gTrade.Buy(lots, _Symbol, ask, sl, tp, "KT MTF buy"))
         Print("Buy order failed. Retcode=", gTrade.ResultRetcode(), " ", gTrade.ResultRetcodeDescription());
      return;
   }

   if(sellSignal)
   {
      if(!BuildStops(false, sl, tp))
      {
         Print("Sell blocked: Trend Catcher levels unavailable.");
         return;
      }
      if(!ValidateStops(false, bid, sl, tp))
      {
         Print("Sell blocked: invalid SL/TP map. bid=", bid, " sl=", sl, " tp=", tp);
         return;
      }

      if(!gTrade.Sell(lots, _Symbol, bid, sl, tp, "KT MTF sell"))
         Print("Sell order failed. Retcode=", gTrade.ResultRetcode(), " ", gTrade.ResultRetcodeDescription());
   }
}
