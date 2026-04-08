import Sec1 from "./Components/ExploreSection1"
import SectionsInfo from "./Components/SectionInfo"
import Sec2 from "./Components/Section2"
import Sec2Box from "./Components/Section2Box"


export default function Explore() {
    return (
        <div className="w-full flex flex-col items-center pt-30 bg-[#121218] font-interFam  pb-80">
            <div className="flex flex-col w-[60%] items-center">
                <h2 className="text-[45px] font-bold">Built for traders who&thinsp;
                    <span className="text-red-500">demand more</span>.
                </h2>
                <p className="text-gray-400 px-40 text-center text-base/relaxed">The most capital-efficient margin system in crypto, designed so every dollar works harder.</p>
            </div>

            <Sec1 />
            <Sec2 />

            <Sec3 />
        </div>
    )
}

function Sec3() {
    return (
        <div className="w-full">


            <SectionsInfo 
                headingLabel=""
                heading=""
                para=""
                point1=""
                point2=""
                point3=""
                tickBGColor=""
                tickColor=""
            />
        </div>
    )
}