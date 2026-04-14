"use client"
import { useEffect, useState } from "react"
import Loader from "../Loader";


export function Main() {
    const [allStokes, setAllStokes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStokeData() {
            try {
                const res = await fetch("/api/lend")
                const data = await res.json();
                //console.log(data);
                //@ts-ignore
                setAllStokes(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        fetchStokeData();
        const interval = setInterval(fetchStokeData, 1000 * 60 * 2);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="flex w-full items-center justify-center bg-black">
            <Stokes loading={loading} allStokes={allStokes} />
        </div>
    )
}


function Stokes({loading, allStokes}: {loading: boolean, allStokes: any[]}) {
    if(loading) {
        return <Loader />
    }
    //console.log(allStokes)

    //const Images: string[] = [
    //    "https://backpack.exchange/coins/paxg.svg", 
    //    "../../../mon.webp", 
    //    "../../../sol.webp", 
    //    "../../../usdc.webp", 
    //    "../../../sui.webp", 
    //    "https://backpack.exchange/coins/paxg.svg", 
    //    "../../../mon.webp", 
    //    "../../../sol.webp", 
    //    "../../../usdc.webp", 
    //    "../../../sui.webp", 
    //    "https://backpack.exchange/coins/paxg.svg", 
    //    "../../../mon.webp", 
    //    "../../../sol.webp", 
    //    "../../../usdc.webp", 
    //    "../../../sui.webp",
    //]

    return (
        <div className="w-full py-5 px-5">
            <div className="bg-[#14151B] pt-5 border border-gray-800 rounded-2xl">
                <div className="px-5">
                    <h3 className="font-bold">Borrow Lend Markets</h3>
                </div>

                <div className="pt-2">
                    <div className="w-full flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-800 pb-3 pt-1 px-5">
                        <div className="pr-40"><h4>Asset</h4></div>
                        <h4>Market Supply</h4>
                        <h4>Market Borrowed</h4>
                        <h4>Utilization</h4>
                        <h4>Lend APY</h4>
                        <h4>Borrow APY</h4>
                        <h4></h4>
                    </div>

                    <div className="w-full flex flex-col gap-2">   
                        {allStokes.map((stoke, index) =>
                            <StokeDets
                                key={index}
                                logo={`https://backpack.exchange/coins/${stoke.symbol?.toLowerCase()}.svg`}
                                stoke={stoke.symbol}
                                stokeShort={stoke.symbol}
                                supply={stoke.totalDeposits}
                                spy={stoke.totalDepositsValue}
                                borrowed={stoke.borrowedQuantity}
                                brwd={stoke.totalBorrowsValue}
                                utilisation={stoke.utilizationRate}
                                lendApy={stoke.depositApy}
                                borrowedApy={stoke.borrowApy}
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