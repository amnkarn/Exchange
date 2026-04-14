import {
  ColorType,
  createChart as createLightWeightChart,
  CrosshairMode,
  ISeriesApi,
  UTCTimestamp,
  CandlestickSeries
} from "lightweight-charts"; //TradingView lib to create charts

// this class help us draw the chart, when we update the candles we don't need to recreate it, just update the class object 
export class ChartManager {
  private candleSeries: ISeriesApi<"Candlestick">;
  private lastUpdateTime: number = 0;
  private chart: any;
  private currentBar: {
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
  } = {
    open: null,
    high: null,
    low: null,
    close: null,
  };

  constructor(
    ref: any, //where to draw the chart
    initialData: any[], //data of the chart
    layout: { background: string; color: string }
  ) {
    
    const chart = createLightWeightChart(ref, { //create the chart
      autoSize: true,
      overlayPriceScales: {
        ticksVisible: true,
        borderVisible: true,
      },
      
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        visible: true,
        ticksVisible: true,
        entireTextOnly: true,
      },
      grid: {
        horzLines: {
          visible: true,
          color: "rgba(255, 255, 255, 0.1)",
        },
        vertLines: {
          visible: true,
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: layout.background,
        },
        textColor: "white",
      },
    });
    
    this.chart = chart;
    this.candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#039E64",
      downColor: "#CE484B"
    });

    this.candleSeries.setData(
      initialData.map((data) => ({
        ...data,
        time: (data.timestamp / 1000) as UTCTimestamp,
      }))
    );
  }

  public update(updatedPrice: any) { //to update the chart for new data
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = new Date().getTime();
    }

    this.candleSeries.update({
      time: (this.lastUpdateTime / 1000) as UTCTimestamp,
      close: updatedPrice.close,
      low: updatedPrice.low,
      high: updatedPrice.high,
      open: updatedPrice.open,
    });

    if (updatedPrice.newCandleInitiated) {
      this.lastUpdateTime = updatedPrice.time;
    }
  }

  public destroy() { //to clean the chart
    this.chart.remove();
  }
}