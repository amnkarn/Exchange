import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";

export function TradeView({ market }: { market: string }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager>(null);

    const init = async () => {
        let klineData: KLine[] = []; //fetch and store in klineData

        try {
            klineData = await getKlines(market, "5m", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor(new Date().getTime() / 1000));

        } catch (e) {
            console.log("Error in TradeView")
        }

        if (chartRef) {
            if (chartManagerRef.current) { //clear prev chart
                chartManagerRef.current.destroy();
            }

            const chartManager = new ChartManager( //create the chart
                chartRef.current,
                [
                    ...klineData?.map((x) => ({
                        close: parseFloat(x.close),
                        high: parseFloat(x.high),
                        low: parseFloat(x.low),
                        open: parseFloat(x.open),
                        timestamp: new Date(x.end).getTime(),
                    })),
                ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
                {
                    background: "#0e0f14",
                    color: "white",
                }
            );
            
            chartManagerRef.current = chartManager;
        }
    };

    useEffect(() => { //on every market switch or firsttime run init() 
        init();
    }, [market]);

    return (
        <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
    );
}