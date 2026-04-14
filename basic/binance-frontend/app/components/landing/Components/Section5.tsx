import { useEffect, useState } from "react";
import PointStruct from "./PointStructureForExplorePage";


export function Sec5() {
    return (
        <div className="w-full flex flex-col items-center justify-center bg-[#0F1116] border-t border-gray-800" id="walletSection">
            <Headings />

            <div className="w-full flex items-center justify-between pl-40">
                <div className="wd-[50%]">
                    <Details />
                </div>
                <div className="w-[50%]">
                    <WalletDark />
                </div>
            </div>
        </div>
    )
}

function Headings() {
    return (
        <div className="my-30 flex flex-col items-center">
            <p className="text-blue-400 text-sm font-semibold">Backpack Wallet</p>
            <h1 className="text-5xl text-white font-bold pt-5">
                Your <span className="text-blue-400">wallet</span> and <span className="text-red-500">exchange</span>, in one place.
            </h1>
            <p className="text-gray-400 px-90 text-center pt-5">Self-custody across 10+ networks, and a direct connection to Backpack Exchange when you need it.</p>
        </div>
    )
}

function Details() {
    return (
        <div className="w-full flex flex-col px-5 py-10">
            <AllLogo />

            <AllPoints />

            <p className="text-sm text-gray-400 pt-5 w-[80%]">Built for power users: multiple accounts, custom RPCs, sidepanel support, and more.</p>

            <div className="flex text-sm font-semibold text-white hover:text-gray-400 cursor-pointer items-center gap-2 pt-5">
                <h4>Downloads</h4>
                <span className="material-symbols-outlined text-lg!">arrow_forward</span>
            </div>
        </div>
    )
}

function AllLogo() {
    const [scaledImg, setScaledImg] = useState(1);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setScaledImg(prev => (prev >= images.length ? 1 : prev + 1));
        }, 1000);

        return () => clearTimeout(timer);
    }, [scaledImg]);


    const images = [
        {img: "../../../sol.webp", index:1 }, 
        {img: "../../../mon.webp", index: 2}, 
        {img: "../../../eth.webp", index: 3},
        {img: "https://backpack.exchange/chains/base.svg", index: 4},
        {img: "https://backpack.exchange/coins/arb.svg", index: 5},
        {img: "https://backpack.exchange/coins/apt.svg", index: 6}
    ]

    return (
        <div className="flex items-center gap-4 pb-7">
            {images.map(image =>
                <div key={image.index}>
                    <LogoSec img={image.img} imgScale={image.index === scaledImg} />
                </div>
            )}
        </div>
    )
}

function AllPoints() {
    return (
        <div className="flex flex-col gap-3">
            <PointStruct
                point="10+ networks. One unified wallet"
                tickColor="#4C87DC"
                tickBGColor="#152A3A"
            />
            <PointStruct
                point="Zero-fee swaps and bridging across networks"
                tickColor="#4C87DC"
                tickBGColor="#152A3A"
            />
            <PointStruct
                point="Manage crypto, DeFi positions, and NFTs in one place"
                tickColor="#4C87DC"
                tickBGColor="#152A3A"
            />
            <PointStruct
                point="Explore and access dApps natively"
                tickColor="#4C87DC"
                tickBGColor="#152A3A"
            />
            <PointStruct
                point="Move assets instantly between wallet and exchange"
                tickColor="#4C87DC"
                tickBGColor="#152A3A"
            />
        </div>
    )
}

function WalletDark() {
    return (
        <img src="../../../wallet-dark.webp" className="w-70 h-130 border-x-8 border-t-8 mx-20 border-[#1C1E25] rounded-t-4xl" alt="" />
    )
}

function LogoSec({img, imgScale}: {img: string, imgScale: boolean}) {
    return (
        <div className={`p-2 rounded-2xl border-2 border-gray-800 bg-[#191A20] transition-all duration-500 
        ${imgScale ? "scale-115 border-gray-400 shadow-lg" : "scale-100 opacity-50"}`}>
            <img src={img} alt="LOGO" className="h-8 w-8" />
        </div>
    )
}