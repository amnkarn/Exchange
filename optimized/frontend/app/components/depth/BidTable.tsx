
export const BidTable = ({ bids }: { bids: [string, string][] }) => {
    let currentTotal = 0;
    const relevantBids = bids;
    //console.log(relevantBids);
    const bidsWithTotal: [string, string, number][] = [];

    for(let i = relevantBids.length-1; i >= 0 ; i--) {
        const [price, quantity] = relevantBids[i];

        currentTotal = parseFloat((currentTotal + parseFloat(quantity)).toFixed(5));
        
        bidsWithTotal.push([price, quantity, currentTotal]);
    }
    //const allBids = relevantBids.
    const allBids = bidsWithTotal.slice(0, 20);

    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    return (
        <div>
            {
                allBids?.map(([price, quantity, total]) => 
                    <Bid maxTotal={maxTotal} total={total} key={price} price={price} quantity={quantity} />)
            }
        </div>
    )
}

function Bid({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return (
        <div style={{ display: "flex", position: "relative", width: "100%", backgroundColor: "transparent", overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: `${(100 * total) / maxTotal}%`,
                    height: "100%",
                    background: "rgba(1, 167, 129, 0.325)",
                    transition: "width 0.3s ease-in-out",
                }}
            ></div>

            <div className={`flex justify-between text-[13px] text-zinc-300 w-full`}>
                <div className="text-[#05AA6C]"> {price} </div>
                <div> {quantity} </div>
                <div> {total.toFixed(5)} </div>
            </div>
        </div>
    )
}