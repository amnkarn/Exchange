"use client";
import { Depth } from "@/app/components/depth/Depth";
import { MarketBar } from "@/app/components/MarketBar";
import { SwapUI } from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { useParams } from "next/navigation"



export default function Page() {
    const { market } = useParams();


    return (
        <div className="flex flex-row flex-1">
            <div className="flex flex-col flex-1">
                {/* Bar on the top of TradinView graph */}
                <MarketBar market={market as string} />

                
            </div>
            <div className="w-px flex-col border-slate-800 border-l"></div>
            
        </div>
    )
}