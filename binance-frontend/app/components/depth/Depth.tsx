"use client";
import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";

export function Depth({ market }: { market: string }) {
    // three main things for "OrderBook"
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

    useEffect(() => {

        const sm = SignalingManager.getInstance(); //live listener
        //exchange only send updated data
        sm.registerCallback("depth", (data: any) => {
            //console.log(data);

            setBids((prevBids) => {
                // creating new map to store all the prev and updated data
                const bidsMap = new Map(prevBids);

                //merge new updates in map
                data.bids.forEach(([price, quantity]: [string, string]) => {
                    const fPrice = String(parseFloat(price));
                    const fQty = String(parseFloat(quantity));

                    if (fQty === "0") {
                        bidsMap.delete(fPrice);
                    } else {
                        bidsMap.set(fPrice, fQty); //add in map
                    }
                });

                // again convert Map in Array
                return Array.from(bidsMap.entries())
                    .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
            });

            setAsks(prevAsks => {
                const asksMap = new Map(prevAsks);

                data.asks.forEach(([price, quantity]: [price: string, quantity: string]) => {
                    const fPrice = String(parseFloat(price));
                    const fQty = String(parseFloat(quantity));

                    if (fQty === "0") {
                        asksMap.delete(fPrice);
                    } else {
                        asksMap.set(fPrice, fQty);
                    }
                })

                return Array.from(asksMap.entries());
                    
            });

        }, `DEPTH-${market}`)

        sm.sendMessage({"method": "SUBSCRIBE", "params": [`depth.200ms.${market}`]});

        // Initial Fetch (The "Now" data)
        getDepth(market).then(d => {
            setBids(d.bids.reverse().map(([p, q]) => [
                String(parseFloat(p)),
                String(parseFloat(q))
            ]));

            setAsks(d.asks.map(([p, q]) => [
                String(parseFloat(p)),
                String(parseFloat(q))
            ]));
        });

        getTicker(market).then(t => setPrice(t.lastPrice));

        return () => { //cleanup
            sm.deRegisterCallback("depth", `DEPTH-${market}`); //remove from callback
            //now don't get the data
            sm.sendMessage({"method": "UNSUBSCRIBE", "params": [`depth.200ms.${market}`]});
        }

    }, [market]) //run on every market update

    return (
        <div className="px-3 pb-2 h-full">
            <TableHeader market={market} />
            {asks && <AskTable asks={asks} />}
            {price && <div className="font-bold text-gray-400">{price}</div>}
            {bids && <BidTable bids={bids} />}
        </div>
    )
}

function TableHeader({ market }: { market: string }) {
    const currTradeIn = market.split("_")[0];

    return (
        <div className="flex justify-between text-xs pb-1">
            <div className="text-white tracking-wider">Price (USD)</div>
            <div className="text-slate-400 tracking-wider">Size ({currTradeIn}) </div>
            <div className="text-slate-400 tracking-wider">Total ({currTradeIn}) </div>
        </div>
    )
}