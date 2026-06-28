import SectionsInfo from "./SectionInfo";
import Sec2Box from "./Section2Box";


export default function Sec2() {
    return (
        <div className="w-full mt-25 flex items-center justify-center gap-7">
            <div className="w-[35%] mr-5">
                <SectionsInfo
                    headingLabel="Risk Management"
                    heading="Cross margin and multi-collateral"
                    para="Maximize capital efficiency with the Unified Backpack Account. Trade perps, predictions, spot, and more — all in the same account."
                    point1="Use BTC, ETH, SOL, and many more assets as collateral"
                    point2="Cross margin across spot, perps, lending, and predictions"
                    point3="Borrow seamlessly against your portfolio"
                    tickBGColor="#2E2418"
                    tickColor="#FFD080"
                />
            </div>

            <div className="w-[35%]">
                <Sec2Box />
            </div>
        </div>
    )
}