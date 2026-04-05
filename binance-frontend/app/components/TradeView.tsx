import { useEffect, useRef, useState } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";
import ChartTopButton from "./Buttons";

export function TradeView({ market }: { market: string }) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager>(null);
    const [chartTimeFrame, setChartTimeFrame] = useState<string>("15m")

    let refreshTime = 1000 * 15; // default 15m
    
    if(chartTimeFrame === "1m" ||  chartTimeFrame === "5m" || chartTimeFrame === "15m") {
        refreshTime = 5000;
    } else if(chartTimeFrame === "1h" || chartTimeFrame === "3h") {
        refreshTime = 1000 * 15;
    } else {
        refreshTime = 6000 * 10 * 60 * 2; // 2h
    }

    const init = async () => {
        let klineData: KLine[] = []; //fetch and store in klineData

        try {
            const chartFrom = Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000);
            const chartTill = Math.floor(new Date().getTime() / 1000);

            // market = SOL_USDC, chartTimeFrame = "15m", chartFrom = "7d", chartTill = currentTime
            klineData = await getKlines(market, chartTimeFrame, chartFrom, chartTill);

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
    
    useEffect(() => {
        init(); //setup initial chart

        const chartFrom = Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000);
        const chartTill = Math.floor(new Date().getTime() / 1000);
        
        const interval = setInterval( async () => {
            const latestKlines = await getKlines(market, chartTimeFrame, chartFrom, chartTill); //get details from api
            const latestBar = latestKlines[latestKlines.length - 1]; // find new bar if created

            if (chartManagerRef.current && latestBar) {
                // Just update the LAST bar, don't recreate the whole chart!
                chartManagerRef.current.update({
                    close: parseFloat(latestBar.close),
                    high: parseFloat(latestBar.high),
                    low: parseFloat(latestBar.low),
                    open: parseFloat(latestBar.open),
                    time: new Date(latestBar.end).getTime() / 1000,
                });
            }

        }, refreshTime) //refresh on every 5m

        return () => clearInterval(interval);
    })

    //useEffect(() => { //on every market switch or firstime run init() 
    //    init();
    //}, [market]);



    return (
        <div className="w-full">
            <div className="w-full h-10 mt-2 px-3 bg-black flex items-center justify-between">
                <div className="flex gap-4">
                    <ChartTopButton name="Chart" />

                    <div className="flex flex-1 justify-center gap-2">
                        {["1m", "5m", "15m", "1h", "4h", "12h", "1d"].map((tf) => (
                            <ChartTopButton
                                key={tf}
                                name={tf}
                                isActive={chartTimeFrame === tf}
                                onClick={() => setChartTimeFrame(tf)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <ChartTopButton name="Depth" />
                    <ChartTopButton name="Margin" />
                </div>
            </div>

            <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
        </div>
    );
}