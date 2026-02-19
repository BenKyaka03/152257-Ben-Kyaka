#property copyright   "KT SuperTrend (customized for EA buffers)"
#property version     "1.00"
#property indicator_chart_window
#property indicator_buffers 7
#property indicator_plots   3

#property indicator_label1  "KT_SuperTrend"
#property indicator_type1   DRAW_COLOR_LINE
#property indicator_color1  clrLimeGreen, clrTomato
#property indicator_width1  2

#property indicator_label2  "BuyArrow"
#property indicator_type2   DRAW_ARROW
#property indicator_color2  clrLime
#property indicator_width2  1

#property indicator_label3  "SellArrow"
#property indicator_type3   DRAW_ARROW
#property indicator_color3  clrDodgerBlue
#property indicator_width3  1

input double InpATRMultiplier = 2.0;
input int    InpATRPeriod     = 10;
input int    InpATRMaxBars    = 5000;
input int    InpShift          = 0;

// Public buffers for iCustom access:
// 0 = SuperTrend line
// 1 = Color index (0 up, 1 down)
// 2 = Buy arrow price
// 3 = Sell arrow price
// 4 = Trend direction (+1 up, -1 down)
double gTrendLine[];
double gTrendColor[];
double gBuyArrow[];
double gSellArrow[];
double gTrendDirection[];

// Internal calculation buffers
double gUp[];
double gDn[];

int gAtrHandle = INVALID_HANDLE;

int OnInit()
{
   SetIndexBuffer(0, gTrendLine, INDICATOR_DATA);
   SetIndexBuffer(1, gTrendColor, INDICATOR_COLOR_INDEX);
   SetIndexBuffer(2, gBuyArrow, INDICATOR_DATA);
   SetIndexBuffer(3, gSellArrow, INDICATOR_DATA);
   SetIndexBuffer(4, gTrendDirection, INDICATOR_DATA);
   SetIndexBuffer(5, gUp, INDICATOR_CALCULATIONS);
   SetIndexBuffer(6, gDn, INDICATOR_CALCULATIONS);

   ArraySetAsSeries(gTrendLine, true);
   ArraySetAsSeries(gTrendColor, true);
   ArraySetAsSeries(gBuyArrow, true);
   ArraySetAsSeries(gSellArrow, true);
   ArraySetAsSeries(gTrendDirection, true);
   ArraySetAsSeries(gUp, true);
   ArraySetAsSeries(gDn, true);

   PlotIndexSetInteger(0, PLOT_SHIFT, InpShift);
   PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, EMPTY_VALUE);

   PlotIndexSetInteger(1, PLOT_SHIFT, InpShift);
   PlotIndexSetInteger(1, PLOT_ARROW, 233); // Wingdings up arrow
   PlotIndexSetDouble(1, PLOT_EMPTY_VALUE, EMPTY_VALUE);

   PlotIndexSetInteger(2, PLOT_SHIFT, InpShift);
   PlotIndexSetInteger(2, PLOT_ARROW, 234); // Wingdings down arrow
   PlotIndexSetDouble(2, PLOT_EMPTY_VALUE, EMPTY_VALUE);

   IndicatorSetString(INDICATOR_SHORTNAME, "KT_SuperTrend");

   gAtrHandle = iATR(_Symbol, _Period, InpATRPeriod);
   if(gAtrHandle == INVALID_HANDLE)
   {
      Print("KT_SuperTrend: failed to create ATR handle.");
      return INIT_FAILED;
   }

   return INIT_SUCCEEDED;
}

int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   if(rates_total < InpATRPeriod + 3)
      return 0;

   ArraySetAsSeries(high, true);
   ArraySetAsSeries(low, true);
   ArraySetAsSeries(close, true);

   int maxBars = MathMin(rates_total - 1, InpATRMaxBars);
   if(maxBars <= 2)
      return 0;

   double atr[];
   ArrayResize(atr, maxBars + 2);
   ArraySetAsSeries(atr, true);

   if(CopyBuffer(gAtrHandle, 0, 0, maxBars + 2, atr) <= 0)
   {
      Print("KT_SuperTrend: failed to copy ATR data. Error=", GetLastError());
      return prev_calculated;
   }

   int start = maxBars;
   if(start > rates_total - 2)
      start = rates_total - 2;

   // Seed the oldest calculated bar from its own midpoint bands.
   if(gTrendDirection[start] == 0 || gTrendDirection[start] == EMPTY_VALUE)
   {
      double seedMid = (high[start] + low[start]) * 0.5;
      gUp[start] = seedMid + InpATRMultiplier * atr[start];
      gDn[start] = seedMid - InpATRMultiplier * atr[start];
      gTrendDirection[start] = 1.0;
      gTrendLine[start] = gDn[start];
      gTrendColor[start] = 0.0;
      gBuyArrow[start] = EMPTY_VALUE;
      gSellArrow[start] = EMPTY_VALUE;
   }

   for(int i = start - 1; i >= 0; --i)
   {
      gBuyArrow[i] = EMPTY_VALUE;
      gSellArrow[i] = EMPTY_VALUE;

      double median = (high[i] + low[i]) * 0.5;
      gUp[i] = median + InpATRMultiplier * atr[i];
      gDn[i] = median - InpATRMultiplier * atr[i];

      double priorDir = gTrendDirection[i + 1];
      double dir = priorDir;

      if(close[i] > gUp[i + 1])
         dir = 1.0;
      else if(close[i] < gDn[i + 1])
         dir = -1.0;

      if(dir > 0 && gDn[i] < gDn[i + 1])
         gDn[i] = gDn[i + 1];
      if(dir < 0 && gUp[i] > gUp[i + 1])
         gUp[i] = gUp[i + 1];

      bool trendFlipUp = (dir > 0 && priorDir < 0);
      bool trendFlipDn = (dir < 0 && priorDir > 0);

      if(trendFlipUp)
         gDn[i] = median - InpATRMultiplier * atr[i];
      else if(trendFlipDn)
         gUp[i] = median + InpATRMultiplier * atr[i];

      gTrendDirection[i] = dir;
      if(dir > 0)
      {
         gTrendLine[i] = gDn[i];
         gTrendColor[i] = 0.0;
      }
      else
      {
         gTrendLine[i] = gUp[i];
         gTrendColor[i] = 1.0;
      }

      double arrowOffset = atr[i] * 0.20;
      if(trendFlipUp)
         gBuyArrow[i] = low[i] - arrowOffset;
      if(trendFlipDn)
         gSellArrow[i] = high[i] + arrowOffset;
   }

   return rates_total;
}
