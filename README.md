# KT SuperTrend EA (Deriv / MT5)

This EA is designed around your latest rules:
- M5/H1/D1 alignment,
- EMA 200 directional filter,
- KT SuperTrend alignment,
- Trend Catcher blue/pink levels used as SL/TP.

Files:
- `MQL5/Indicators/KT_SuperTrend.mq5`
- `MQL5/Experts/KT_MTF_TrendCatcher_EA.mq5`

---

## Why the EA was not attaching (root cause and fix)
The most likely issue was **Trend Catcher handle creation failure in `OnInit()`** due to indicator-name/input mismatch.

What was fixed:
1. Default Trend Catcher name updated to `Trend Catcher (with dash)`.
2. Added fallback auto-try names (`Trend Catcher (with dash)`, `Trend Catcher`, `Trend catcher`, etc.).
3. Added optional explicit Trend Catcher input passing (`InpTrendCatcherUseExplicitInputs`) for cases where defaults are not enough.
4. Added clearer initialization logs so Journal shows which name failed/succeeded.

If attach still fails, check Experts/Journal tab for `OnInit failed` and the exact indicator name/error.

---

## Implemented trading logic

### Entry (M5 execution)
EA enters only when M5/H1/D1 all align:
- Price above EMA(200) + SuperTrend bullish + arrow alignment => BUY
- Price below EMA(200) + SuperTrend bearish + arrow alignment => SELL

Arrow behavior:
- `InpRequireArrowAlignmentAllTF=true`: all 3 TFs must have a recent arrow within `InpArrowLookbackBars`.
- `false`: M5 arrow timing with H1/D1 directional alignment.

### Stop Loss / Take Profit (Trend Catcher)
- Blue level buffer = `InpTrendBlueBuffer` (default `5`, `lineSup`)
- Pink level buffer = `InpTrendPinkBuffer` (default `6`, `lineRes`)

Mapping:
- Buy: `SL=blue`, `TP=pink`
- Sell: `SL=pink`, `TP=blue`

### Position handling
- New-bar execution on M5.
- Spread filter.
- Symbol+magic position ownership.
- Optional close on opposite signal (`InpCloseOnOppositeSignal`).

---

## Detailed input reference

## A) General
- `InpMagicNumber`: Unique ID for this EA’s trades.
- `InpFixedLots`: Fixed lot size to send.
- `InpOnePositionPerSymbol`: Keep one EA position per symbol.
- `InpCloseOnOppositeSignal`: Close existing trade when opposite full signal appears.

## B) Signal Filters
- `InpEMAPeriod`: EMA period (default 200).
- `InpRequireArrowAlignmentAllTF`: strict arrow alignment mode.
- `InpArrowLookbackBars`: bars to look back for each timeframe arrow.

## C) KT SuperTrend inputs
- `InpSuperTrendName`: compiled indicator name.
- `InpATRMultiplier`, `InpATRPeriod`, `InpATRMaxBars`, `InpShift`: passed into KT SuperTrend `iCustom`.

## D) Trend Catcher inputs (this is what you asked about)
These are now aligned with your screenshot/code.

### 1) Indicator identity and behavior
- `InpTrendCatcherName`: **must match file name in Indicators folder**.
- `InpTrendCatcherUseExplicitInputs`:
  - `false` => EA loads Trend Catcher with indicator defaults.
  - `true` => EA passes explicit full input list below.

### 2) Inputs matching your Trend Catcher dialog
- `InpTC_TimeFrames` -> `Time frames`
- `InpTC_Sensitivity` -> `Sensitivity`
- `InpTC_DisplayMode` -> `Display mode`
- `InpTC_TrendChangeCode` -> `Trend change "dot" code`
- `InpTC_TrendDotsCode` -> `Trend "dots" code`

Arrows section:
- `InpTC_ArrowCodeUp`
- `InpTC_ArrowCodeDown`
- `InpTC_ArrowsSize`
- `InpTC_ArrowsShift`
- `InpTC_ArrowsColorUp`
- `InpTC_ArrowsColorDown`
- `InpTC_ArrowsLimit`

Alerts section:
- `InpTC_AlertsOn`
- `InpTC_AlertsMessage`
- `InpTC_AlertsSound`
- `InpTC_AlertsEmail`
- `InpTC_AlertsPush`

Dash section:
- `InpTC_DashDisplay`
- `InpTC_DashUniqueID`
- `InpTC_DashBars`
- `InpTC_DashFont`
- `InpTC_DashCorner`
- `InpTC_DashSentimentWidth`
- `InpTC_DashFontSize`
- `InpTC_DashFontColor`
- `InpTC_DashBackColor`
- `InpTC_DashBorderColor`
- `InpTC_DashHeadColor`
- `InpTC_DashHeadTextColor`
- `InpTC_DashColorBull`
- `InpTC_DashColorBear`
- `InpTC_DashColorMarker`
- `InpTC_DashTransparency`
- `InpTC_DashXPos`
- `InpTC_DashYPos`

### 3) Trend Catcher buffers used for trading
- `InpTrendBlueBuffer=5` (`lineSup`)
- `InpTrendPinkBuffer=6` (`lineRes`)

## E) Execution
- `InpMaxSpreadPoints`: max spread allowed.
- `InpSlippagePoints`: trade deviation in points.

---

## Quick setup checklist
1. Compile `KT_SuperTrend.mq5`.
2. Compile your Trend Catcher indicator.
3. Confirm exact Trend Catcher file name, then set `InpTrendCatcherName`.
4. If still not attaching, set `InpTrendCatcherUseExplicitInputs=true`.
5. Attach EA on M5 and check Journal for initialization line.
