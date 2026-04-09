import Sec1 from "./Components/ExploreSection1"
import Sec2 from "./Components/Section2"
import Sec3 from "./Components/Section3"
import Sec4 from "./Components/Section4"


export default function Explore() {
    return (
        <div className="w-full flex flex-col items-center pt-30 bg-[#121218] font-interFam pb-20">
            <div className="flex flex-col w-[60%] items-center">
                <h2 className="text-[45px] font-bold">Built for traders who&thinsp;
                    <span className="text-red-500">demand more</span>.
                </h2>
                <p className="text-gray-400 px-40 text-center text-base/relaxed">The most capital-efficient margin system in crypto, designed so every dollar works harder.</p>
            </div>

            <Sec1 />
            <Sec2 />
            <Sec3 />

            <Sec4 />
        </div>
    )
}