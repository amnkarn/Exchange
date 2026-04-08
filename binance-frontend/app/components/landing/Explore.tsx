import Sec1 from "./Components/ExploreSection1"
import Sec2Info from "./Components/Sec2Info"
import Sec2Box from "./Components/Section2Box"


export default function Explore() {
    return (
        <div className="w-full flex flex-col items-center pt-30 bg-[#121218] font-interFam  pb-80">
            <div className="flex flex-col w-[60%] items-center">
                <h2 className="text-[42px] font-bold">Built for traders who&thinsp;
                    <span className="text-red-500">demand more</span>.
                </h2>
                <p className="text-gray-400 px-40 text-center text-base/relaxed">The most capital-efficient margin system in crypto, designed so every dollar works harder.</p>
            </div>

            <Sec1 />

            <Sec2 />
        </div>
    )
}


function Sec2() {
    return (
        <div className="w-full flex items-center justify-center gap-5">
            <div className="w-[35%]">
                <Sec2Info
                    headingLabel="Risk Management"
                    heading="Cross margin and multi-collateral"
                    para="Maximize capital efficiency with the Unified Backpack Account. Trade perps, predictions, spot, and more — all in the same account."
                    point1="Use BTC, ETH, SOL, and many more assets as collateral"
                    point2="Cross margin across spot, perps, lending, and predictions"
                    point3="Borrow seamlessly against your portfolio"
                />
            </div>

            <div className="w-[35%]">
                <Sec2Box />
            </div>
        </div>
    )
}