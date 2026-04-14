import { Dispatch, SetStateAction, useState } from "react";


export default function TradeCard({active}: {active: number}) {
    return (
        <div className="bg-[#16181E] w-[45%] mt-10 rounded-3xl px-10 pt-8 overflow-hidden">
            <div className="scale-100 hover:scale-102 transition-transform">
                { active === 1 ? <TradeSideComp /> :  <InvestSideComp /> }
            </div>

        </div>
    )
}

function TradeSideComp() {
    return (
        <>
            <div className="flex flex-col gap-5">
                <h2 className="text-2xl font-bold">Trade</h2>
                <p className="text-[#939CAC] text-sm">The most capital-efficient margin system in crypto. Perps, spot, and predictions — all cross-margined, all earning yield.</p>

                <div className="w-full flex gap-1 mt-3">
                    <MiniTags para="Perpetual Features" />
                    <MiniTags para="Spot Trading" />
                    <MiniTags para="Margin Trading" />
                    <MiniTags para="Predictions" />
                </div>
            </div>

            <BuySellComponent />
        </>
    )
}

function InvestSideComp() {
    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold">Invest</h2>
            <p className="text-[#939CAC] text-sm">
                Lending, fiat rails, and stocks (coming soon) - a better home for your money. Earn yield without thinking about it.
            </p>

            <div className="w-full flex gap-1 mt-3">
                <MiniTags para="Lending" />
                <MiniTags para="Flat On/Of Ramps" />
                <MiniTags para="Stocks (Coming soon)" />
            </div>

            <MarketDets />
        </div>
    )
}

function MiniTags({ para }: { para: string }) {
    return (
        <h4 className="text-[#878E9C] text-xs bg-black px-2 py-1 rounded-lg">{para}</h4>
    )
}

function BuySellComponent() {
    const [button, setButton] = useState<number>(1); // buy & sell button

    const [filter, setFilter] = useState<number>(1);
    const [conditionalOptions, setConditionalOptions] = useState<boolean>(false);

    return (
        <div className="w-[70%] rounded-2xl flex flex-col  justify-center bg-[#0E0F14] place-self-center mt-15 pb-5">
            <div className="px-3 py-2" onClick={() => setConditionalOptions(false)}>
                {/*Buy and Sell toggle*/}
                <div className="flex bg-[#14151B] border border-gray-700 rounded-xl text-gray-400 mt-2">
                    <div className={`px-21.5 py-2 rounded-xl cursor-pointer ${button === 1 ? "bg-[#172726] text-[#02B873]" : ""}`} onClick={() =>
                        setButton(1)}
                    >
                        Buy
                    </div>

                    <div className={`px-21.5 py-2 rounded-xl cursor-pointer ${button === 2 ? "bg-[#321E23] text-[#F3484C]" : ""}`} onClick={() =>
                        setButton(2)}
                    >
                        Sell
                    </div>
                </div>

                {/*Filter Row*/}
                <div className="flex mt-2 items-center pt-2 relative">
                    <h4 className={`px-3 py-1.5 text-xs font-medium cursor-pointer ${filter === 1 ? "px-2 py-1 bg-[#1E1F25] rounded-lg" : ""}`} 
                    onClick={() => setFilter(1)} >
                        Limit
                    </h4>

                    <h4 className={`px-3 py-1.5 text-xs font-medium cursor-pointer ${filter === 2 ? "px-2 py-1 bg-[#1E1F25] rounded-lg" : ""}`} 
                    onClick={() => setFilter(2)} >
                        Market
                    </h4>
                    
                    {/* Conditional Dropdown Trigger */}
                    <div className="relative">
                        <div 
                            className={`flex items-center px-3 py-1.5 text-xs font-medium cursor-pointer ${filter === 3 ? "bg-[#1E1F25] rounded-lg" : ""}`} 
                            onClick={(e) => {
                                e.stopPropagation(); // Rokega parent tak event jaane se
                                setFilter(3);
                                setConditionalOptions(!conditionalOptions); // Toggle logic
                            }}
                            >
                            <h4 className="text-xs font-medium">Conditional</h4>
                            <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                        </div>
                        

                        {conditionalOptions && (
                            <div className="absolute top-full left-0 mt-2 bg-black border border-gray-700 rounded-xl z-50 py-3 px-4 shadow-2xl flex flex-col text-sm gap-1">
                                <p className="hover:bg-[#1E1F25] px-2 py-1 rounded-lg">Conditional</p>
                                <p className="hover:bg-[#1E1F25] px-2 py-1 rounded-lg">Scalable</p>
                                <p className="hover:bg-[#1E1F25] px-2 py-1 rounded-lg">TWAP</p>
                            </div>
                        )}
                    </div>
                </div>


                <div className="w-full flex-col">
                    <div className="flex justify-between items-center px-1 py-2">
                        <p className="text-xs">Balance</p>
                        <p className="text-xs">0 USD</p>
                    </div>
                    <p className="w-full px-2 text-gray-600">----------------------------------------------------</p>
                </div>

                <div className="flex flex-col">
                    <BuyAndSellInput 
                        title="Price" 
                        rightTitle="Mid | BBO" 
                        inputValue="70,794.6"
                        img="https://backpack.exchange/coins/usd.svg"
                    />

                    <BuyAndSellInput 
                        title="Quantity"
                        inputValue="0"
                        img="https://backpack.exchange/coins/btc.svg"
                    />

                    <div className="flex flex-col px-1 py-4">
                        <input type="range" min={0} max={100} className="appearance-none h-1 bg-gray-700 rounded-lg cursor-pointer accent-blue-600"/>

                        <div className="flex justify-between items-center px-1 py-2 text-xs text-gray-600">
                            <p> 0 </p>
                            <p> 100% </p>
                        </div>
                    </div>

                    <BuyAndSellInput 
                        title="Order Value"
                        inputValue="0"
                        img="https://backpack.exchange/coins/usd.svg"
                    />

                    <button className={`w-full py-2.5 rounded-xl text-black mt-4 ${button === 1 ? "bg-[#00C278]" : "bg-red-500"}`}>
                        {button === 1 ? "Buy" : "Sell"}
                    </button>

                    <div className="flex text-xs py-2 gap-3 text-gray-400">
                        <p>Post Only</p>
                        <p>IOC</p>
                        <p>Margin</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface BuySellInput {
    title: string, 
    rightTitle?: string, 
    inputValue: string, 
    img: string
}

function BuyAndSellInput({ title, rightTitle, inputValue, img }: BuySellInput) {
    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center px-1 py-2">
                <p className="text-xs text-gray-600"> {title} </p>
                <p className="text-xs text-blue-800"> {rightTitle} </p>
            </div>

            <div className="flex justify-between bg-[#191A20] px-5 py-2.5 rounded-lg">
                <input type="text" disabled placeholder={inputValue} className="placeholder-white" />
                <img src={img} alt="img" className="w-6" />
            </div>
        </div>
    )
}

function MarketDets() {
    return (
        <div className="py-5 px-5 my-10 bg-black rounded-2xl">
            <div className="flex justify-between">
                <p className="text-sm text-gray-400">Account</p>
                <p className="text-sm text-gray-400">Balance</p>
                <p className="text-sm text-gray-400">APY</p>
            </div>

            <div className="flex gap-55 py-2 text-sm">
                <p>Crypto</p>
                <p>$49,329.23</p>
            </div>

            <div className="flex flex-col">
                <StockDets 
                    stock="USD"
                    img="https://backpack.exchange/coins/usd.svg"
                    balance="9,816.87"
                    secondBal="$9,816.87"
                    API="3.11%"
                    secondAPI="~$305.30/yr"
                />
                <StockDets 
                    stock="SOL"
                    img="../../../../sol.webp"
                    balance="331.04"
                    secondBal="$28,997.54"
                    API="5.45%"
                    secondAPI="~$1,580.37/yr"
                />
                <StockDets 
                    stock="ETH"
                    img="../../../../eth.webp"
                    balance="2.705"
                    secondBal="$9,514.82"
                    API="1.88%"
                    secondAPI="~$178.88/yr"
                />
            </div>
        </div>
    )
}

interface StockDetails {
    stock: string,
    img: string,
    balance: string,
    secondBal: string,
    API: string,
    secondAPI: string
}

function StockDets(props: StockDetails) {
    return (
        <div className="ml-3 flex justify-between">
            <div className="flex gap-2 items-center">
                <img src={props.img} className="w-6" />
                <h4 className="font-semibold text-sm">{props.stock}</h4>
            </div>

            <div className="flex flex-col pl-12 text-end">
                <p className="text-sm text-white">{props.balance}</p>
                <p className="text-xs text-gray-400">{props.secondBal}</p>
            </div>

            <div className="flex flex-col justify-center text-end">
                <p className="text-sm text-green-500">{props.API}</p>
                <p className="text-[10px] text-green-700">{props.secondAPI}</p>
            </div>
        </div>
    )
}