import PointStruct from "./PointStructureForExplorePage";

interface Info {
    headingLabel: string,
    heading: string,
    para: string,
    point1: string,
    point2: string,
    point3: string,
    point4?: string,
}

export default function Sec2Info(props: Info) {
    return (
        <div className="w-full rounded-2xl shadow-lg shadow-gray-900">
            <div className="flex flex-col bg-[#111117] py-8 gap-5 ">
                <div className="px-3 py-1 w-fit rounded-2xl bg-[#2E2418] text-[#D6AE6C] text-[10px] border border-gray-700">{props.headingLabel}</div>

                <div className="text-3xl text-white font-semibold">{props.heading}</div>

                <p className="text-gray-400 text-sm">{props.para}</p>

                <div className="flex flex-col gap-2 pt-2">
                    <PointStruct point={props.point1} tickBGColor="#2E2418"  tickColor={"#FFD080"}/>
                    <PointStruct point={props.point2} tickBGColor="#2E2418" tickColor={"#FFD080"}/>
                    <PointStruct point={props.point3} tickBGColor="#2E2418" tickColor={"#FFD080"}/>
                </div>
            </div>
        </div>
    )
}