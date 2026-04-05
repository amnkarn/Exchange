"use client";
import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";

export function Depth({ market }: { market: string }) {
    // three main things for "OrderBook"
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

    function clearState() {
        setBids([]);
        setAsks([]);
        setPrice("");
    }

    useEffect(() => {
        clearState();

        setInterval(() => {
            getDepth(market).then(d => { // save in states
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
        }, 3500)

    }, [market]) //run on every market update

    return (
        <div className="px-3 py-2">
            <TableHeader market={market} />
            {asks && <AskTable asks={asks} />}
            {price && <div>{price}</div>}
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