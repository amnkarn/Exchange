

export function Main() {
    return (
        <div className="flex w-full items-center justify-center bg-black">
            <Stokes />
        </div>
    )
}


function Stokes() {
    const Stokes = [
        {
            logo: "https://backpack.exchange/coins/paxg.svg",
            stoke: "PAX Gold", stk: "PAXG",
            supply: "264.4", spy: "$1.2M",
            borrow: "39.1", brw: "$186.7k",
            utilization: "14.77%",
            lendApy: "30.19%",
            borrowApy: "1.48%",
        },
        {
            logo: "../../../mon.webp",
            stoke: "Monal", stk: "MON",
            supply: "32.6M", spy: "$1.0M",
            borrow: "3.8M", brw: "$121.9k",
            utilization: "11.68%",
            lendApy: "13.37%",
            borrowApy: "1.36%",
        },
        {
            logo: "../../../sol.webp",
            stoke: "Solana", stk: "SOL",
            supply: "406.4k", spy: "$34.1M",
            borrow: "164.6", brw: "$13.8k",
            utilization: "40.52%",
            lendApy: "4.97%",
            borrowApy: "2.32%",
        },
        {
            logo: "../../../usdc.webp",
            stoke: "Us Doller", stk: "USD",
            supply: "133.5M", spy: "$133.5M",
            borrow: "26.1M", brw: "$26.06M",
            utilization: "19.54%",
            lendApy: "4.21%",
            borrowApy: "1.55%",
        },
        {
            logo: "../../../sui.webp",
            stoke: "Sui", stk: "SUI",
            supply: "444.2K", spy: "$414.9K",
            borrow: "171.5K", brw: "$160.2k",
            utilization: "38.62%",
            lendApy: "1.77%",
            borrowApy: "5.41%",
        },

        {
            logo: "https://backpack.exchange/coins/paxg.svg",
            stoke: "PAX Gold", stk: "PAXG",
            supply: "264.4", spy: "$1.2M",
            borrow: "39.1", brw: "$186.7k",
            utilization: "14.77%",
            lendApy: "30.19%",
            borrowApy: "1.48%",
        },
        {
            logo: "../../../mon.webp",
            stoke: "Monal", stk: "MON",
            supply: "32.6M", spy: "$1.0M",
            borrow: "3.8M", brw: "$121.9k",
            utilization: "11.68%",
            lendApy: "13.37%",
            borrowApy: "1.36%",
        },
        {
            logo: "../../../sol.webp",
            stoke: "Solana", stk: "SOL",
            supply: "406.4k", spy: "$34.1M",
            borrow: "164.6", brw: "$13.8k",
            utilization: "40.52%",
            lendApy: "4.97%",
            borrowApy: "2.32%",
        },
        {
            logo: "../../../usdc.webp",
            stoke: "Us Doller", stk: "USD",
            supply: "133.5M", spy: "$133.5M",
            borrow: "26.1M", brw: "$26.06M",
            utilization: "19.54%",
            lendApy: "4.21%",
            borrowApy: "1.55%",
        },
        {
            logo: "../../../sui.webp",
            stoke: "Sui", stk: "SUI",
            supply: "444.2K", spy: "$414.9K",
            borrow: "171.5K", brw: "$160.2k",
            utilization: "38.62%",
            lendApy: "1.77%",
            borrowApy: "5.41%",
        },

        {
            logo: "https://backpack.exchange/coins/paxg.svg",
            stoke: "PAX Gold", stk: "PAXG",
            supply: "264.4", spy: "$1.2M",
            borrow: "39.1", brw: "$186.7k",
            utilization: "14.77%",
            lendApy: "30.19%",
            borrowApy: "1.48%",
        },
        {
            logo: "../../../mon.webp",
            stoke: "Monal", stk: "MON",
            supply: "32.6M", spy: "$1.0M",
            borrow: "3.8M", brw: "$121.9k",
            utilization: "11.68%",
            lendApy: "13.37%",
            borrowApy: "1.36%",
        },
        {
            logo: "../../../sol.webp",
            stoke: "Solana", stk: "SOL",
            supply: "406.4k", spy: "$34.1M",
            borrow: "164.6", brw: "$13.8k",
            utilization: "40.52%",
            lendApy: "4.97%",
            borrowApy: "2.32%",
        },
        {
            logo: "../../../usdc.webp",
            stoke: "Us Doller", stk: "USD",
            supply: "133.5M", spy: "$133.5M",
            borrow: "26.1M", brw: "$26.06M",
            utilization: "19.54%",
            lendApy: "4.21%",
            borrowApy: "1.55%",
        },
        {
            logo: "../../../sui.webp",
            stoke: "Sui", stk: "SUI",
            supply: "444.2K", spy: "$414.9K",
            borrow: "171.5K", brw: "$160.2k",
            utilization: "38.62%",
            lendApy: "1.77%",
            borrowApy: "5.41%",
        },
    ]

    return (
        <div className="w-full py-5 px-5">
            <div className="bg-[#14151B] pt-5  border border-gray-800 rounded-2xl">

                <div className="px-5">
                    <h3 className=" font-bold">Borrow Lend Markets</h3>
                </div>

                <div className="pt-2">
                    <div className="w-full flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-800 pb-3 pt-1 px-5">
                        <div className="pr-40">
                            <h4>Asset</h4> </div>
                        <h4>Market Supply</h4>
                        <h4>Market Borrowed</h4>
                        <h4>Utilization</h4>
                        <h4 className="flex items-center">
                            <span className="material-symbols-outlined">arrow_downward_alt</span> Lend APY
                        </h4>
                        <h4>Borrow APY</h4>
                        <h4></h4>
                        <h4></h4>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        {Stokes.map((stoke, index) =>
                            <StokeDets
                                logo={stoke.logo}
                                stoke={stoke.stoke}
                                stokeShort={stoke.stk}
                                supply={stoke.supply}
                                spy={stoke.spy}
                                borrowed={stoke.borrow}
                                brwd={stoke.brw}
                                utilisation={stoke.utilization}
                                lendApy={stoke.lendApy}
                                borrowedApy={stoke.borrowApy}
                                key={index}
                            />
                        )}
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
    supply: string,
    spy: string,
    borrowed: string,
    brwd: string,
    utilisation: string,
    lendApy: string,
    borrowedApy: string
}

function StokeDets(props: Stoke) {
    return (
        <div className="w-full flex items-center justify-between px-5 border-b border-gray-800 py-2 cursor-pointer">
            <div className="relative py-5">
                <div className="flex gap-2 items-center absolute top-0 left-0">
                    <img src={props.logo} className="w-8 h-8" alt="#LOGO" />
                    <div className="flex flex-col pl-1">
                        <h5 className="text-[13px] text-nowrap">{props.stoke}</h5>
                        <p className="text-xs text-gray-400">{props.stokeShort}</p>
                    </div>
                </div>
            </div>

            <div className="relative ml-15">
                <div className="flex flex-col ml-20 top-0 ">
                    <h5 className="text-[13px] text-end">{props.supply}</h5>
                    <p className="text-xs text-gray-400 text-end">{props.spy}</p>
                </div>
            </div>

            <div className="relative mb-10 ml-4">
                <div className="flex flex-col absolute top-0 ">
                    <h5 className="text-[13px] text-end">{props.borrowed}</h5>
                    <p className="text-xs text-gray-400 text-end">{props.brwd}</p>
                </div>
            </div>

            <div className="relative bottom-3">
                <h5 className="text-[13px] absolute top-0">{props.utilisation}</h5>
            </div>

            <div className="relative bottom-3">
                <h5 className="text-[13px] absolute left-5 text-green-600">{props.lendApy}</h5>
            </div>

            <div className="relative bottom-3">
                <h5 className="text-[13px] absolute left-8 text-red-500">{props.borrowedApy}</h5>
            </div>

            <div className="relative">
                <div className="flex items-center text-blue-500 gap-5 text-sm">
                    <h3>Lend</h3>
                    <h3>Borrow</h3>
                    <span className="material-symbols-outlined">more_vert</span>
                </div>
            </div>
        </div>
    )
}