"use client"
import { useState } from "react"


export default function Sec4() {
    return (
        <div className="w-full my-30 flex items-center justify-center pr-5">
            <div className="w-[45%] flex">
                <Sec4Details />
            </div>
            <div className="w-[45%] ">
                <BalanceDiv />
            </div>

        </div>
    )
}

function Sec4Details() {
    const sec4DivList = [
        {serial: 1, heading: "Deposit", para: "You deposit 1,000 USDC and 10 SOL. Multi-collateral means both count toward your buying power."},
        {serial: 2, heading: "Auto-lend", para: "Your deposits are automatically lent out. You start earning yield immediately — no action needed."},
        {serial: 3, heading: "Trade", para: "Long BTC, open a predictions trade, buy AAPL stock — all from the same subaccount."},
        {serial: 4, heading: "Compound", para: "Your positions win. PnL gets lent out automatically, earning yield on your gains. The cycle repeats."}
    ]
    const [selectedId, setSelectedId] = useState(1);

    return (
        <div className="w-full pl-30 py-5 flex flex-col">
            <div className="py-5 text-[48px] text-white font-semibold text-base/16">
                <h2>More margin.</h2>
                <h2 className="text-[#FD4B4E]">More yield.</h2>
                <h2 className="pr-20">More from every dollar.</h2>
            </div>
            <p className="text-gray-400 text-lg pr-30">Watch what happens when your capital actually works for you.</p>

            <div className="flex flex-col gap-2 pt-8">
                {sec4DivList.map((dets) =>
                    <div onClick={() => setSelectedId(dets.serial)} key={dets.serial}>
                        <Sec4ListDiv
                            serial={dets.serial}
                            mainHead={dets.heading}
                            para={dets.para}
                            selected={selectedId === dets.serial}
                            key={dets.serial}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

type Div = {
    serial: number, 
    mainHead: string, 
    para: string, 
    selected: boolean
}

function Sec4ListDiv(props: Div) {
    return (
        <div 
            className={`flex items-start gap-3 px-2 py-4 mr-30 ${props.selected ? 'border bg-[#14151B] border-gray-800 rounded-lg' : ''}`}
        >
            <div className={`
                py-1.5 pl-3 pr-2.5 text-xs font-semibold rounded-full transition-colors duration-200
                ${props.selected ? 'bg-white text-black font-bold' : 'bg-[#17171E] text-gray-500'}
            `}>
                <p>{props.serial}</p>
            </div>


            <div className="w-full">
                <h3 className={`text-gray-500 font-medium text-sm ${props.selected ? "text-white" : ""}`}>{props.mainHead}</h3>
                {props.selected &&
                    <p className="text-gray-400 text-[12px] text-base/4 pt-1">{props.para}</p>}
            </div>
        </div>
    )
}


function BalanceDiv() {
    return (
        <div className="w-full bg-[#15161B] py-5 ">
            <div className="bg-black mr-30 pt-5  border border-gray-800 rounded-2xl">

                <div className="px-5 pb-5 border-b border-gray-800">
                    <h3 className=" font-bold">Balances</h3>
                    <div className="flex gap-5 mt-2">
                        <h5 className="px-3 py-1.5 bg-[#15161C] rounded-lg text-xs cursor-pointer">Assets</h5>
                        <h5 className="px-3 py-1.5 bg-[#15161C] rounded-lg text-xs cursor-pointer">Statements</h5>
                    </div>
                </div>

                <div className="pt-2">
                    
                    <div className="w-full flex items-center justify-between text-xs font-semibold text-gray-400 border-b border-gray-800 pb-3 pt-1 px-5">
                        <h4 className="pr-20">Asset</h4>
                        <h4>Total Balance</h4>
                        <h4>Availble Balance</h4>
                        <h4>Lend & Borrow</h4>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <StokeDets 
                            logo="../../../usdc.webp"
                            stoke="US Dollar"
                            stokeShort="USD"
                            totalBal="1000"
                            totalBalDollar="$1,000.00"
                            lendBorrow="1000"
                            lendBorrowPersentage="(3.58% ⚡)"
                        />
                        <StokeDets 
                            logo="../../../sol.webp"
                            stoke="Solana"
                            stokeShort="SOL"
                            totalBal="10"
                            totalBalDollar="$850.00"
                            lendBorrow="10"
                            lendBorrowPersentage="(6.28% ⚡)"
                        />
                        <StokeDets 
                            logo="https://backpack.exchange/coins/btc.svg"
                            stoke="Bitcoin"
                            stokeShort="BTC"
                            totalBal="2"
                            totalBalDollar="$138,000.00"
                            lendBorrow="2"
                            lendBorrowPersentage="(0.02%)"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

type Stoke = {
    logo: string,
    stoke: string,
    stokeShort: string,
    totalBal: string,
    totalBalDollar: string,
    lendBorrow: string,
    lendBorrowPersentage: string
}

function StokeDets(props: Stoke) {
    return (
        <div className="w-full flex items-center justify-between px-5 border-b border-gray-800 py-2">
            <div className="flex gap-2 items-center ">
                <img src={props.logo} className="w-7 h-7" alt="#LOGO" />
                <div className="flex flex-col">
                    <h5 className="text-sm text-end">{props.stoke}</h5>
                    <p className="text-xs text-gray-400">{props.stokeShort}</p>
                </div>
            </div>

            <div className="flex flex-col">
                <h5 className="text-sm text-end">{props.totalBal}</h5>
                <p className="text-xs text-gray-400 text-end">{props.totalBalDollar}</p>
            </div>

            <div className="flex flex-col">
                <h5 className="text-sm text-end">0</h5>
                <p className="text-xs text-gray-400 text-end">$0.00</p>
            </div>

            <div className="flex flex-col">
                <h5 className="text-sm text-end">{props.lendBorrow}</h5>
                <p className="text-xs text-gray-400 text-end">{props.lendBorrowPersentage}</p>
            </div>
        </div>
    )
}