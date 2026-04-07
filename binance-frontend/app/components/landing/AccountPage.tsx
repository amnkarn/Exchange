"use client";
import { useState } from "react"
import TradeCard from "./Components/TradeCard";


export default function AccountPage() {
    const [active, setActive] = useState<number>(1);

    return (
        <div className="w-full flex flex-col items-center justify-center py-5 font-interFam">

            <div className="flex justify-evenly w-[55%] px-8 py-7 mt-20 gap-2 bg-[#13141A] border border-gray-700 rounded-4xl">
                <BoxDiv heading="$400B+" para="Volume" rightBorder={true} />
                <BoxDiv heading="1B" para="Transactions" rightBorder={true} />
                <BoxDiv heading="$350M+" para="Under Custody" rightBorder={true} />
                <BoxDiv heading="150+" para="Countries" />
            </div>

            <div className="flex flex-col gap-5 items-center justify-center mt-20 w-[50%]">
                <h1 className="text-5xl font-[600] font-interFam text-[#FD4B4E] tracking-tight">
                    Trade
                    <span className="text-white">.</span> &thinsp;
                    Invest
                    <span className="text-white">.</span> &thinsp;
                    Earn
                    <span className="text-white">.</span>
                </h1>

                <h1 className="flex text-5xl font-[600] font-interFam text-white tracking-tight">All from one account.</h1>


                <p className="text-[#939CAC] text-[20px] pt-5 px-5 text-center text-base/relaxed">
                    Whether you're a trader executing complex strategies or just want a better place for your money, Backpack delivers more.
                </p>
            </div>

            <div className="flex bg-[#14151B] border border-gray-700 rounded-4xl text-gray-400 mt-15">
                <div className={`px-7 py-2.5 rounded-3xl cursor-pointer ${active === 1 ? "bg-white text-black" : ""}`} onClick={() => setActive(1)} >
                    Trade
                </div>

                <div className={`px-7 py-2.5 rounded-3xl cursor-pointer ${active === 2 ? "bg-white text-black" : ""}`} onClick={() => setActive(2)} >
                    Invest
                </div>
            </div>

            <TradeCard />

        </div>
    )
}

function BoxDiv({ heading, para, rightBorder }: { heading: string, para: string, rightBorder?: boolean }) {
    return (
        <div className={`flex flex-col gap-2 items-center font-interFam py pr-8 ${rightBorder ? "border-r border-r-gray-700" : ""}`}>
            <h3 className="text-3xl font-semibold"> {heading} </h3>
            <p> {para} </p>
        </div>
    )
}