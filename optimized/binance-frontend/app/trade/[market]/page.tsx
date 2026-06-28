"use client";
import { Depth } from "@/app/components/depth/Depth";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { useParams } from "next/navigation"

export default function Page() {
    const { market } = useParams(); //ex -> SOL_USDC

    return (
        <div className="flex flex-row flex-1 h-screen overflow-hidden">
            <div className="flex flex-col flex-1 gap-3">
                {/* Bar on the top of TradinView graph */}
                <MarketBar market={market as string} />

                <div className="flex flex-row flex-1 overflow-hidden">
                    <div className="flex flex-col flex-1 px-2">
                        {/* Trading view chart */}
                        <TradeView market={market as string} />
                    </div>

                    <div className="w-px flex-col border-slate-800 border-l"></div>

                    <div className="flex flex-col w-80 min-w-80 h-150 overflow-y-scroll no-scrollbar">
                        {/* OrderBook in the right side */}
                        <Depth market={market as string} />
                    </div>
                </div>
            </div>

            <div className="w-px flex-col border-slate-800 border-l"></div>

            <div className="flex flex-col" style={{ width: "360px", minWidth: "350px" }}>
                {/*Buy and Sell stocks*/}
                <SwapUI market={market as string} />
            </div>
        </div>
    )
}