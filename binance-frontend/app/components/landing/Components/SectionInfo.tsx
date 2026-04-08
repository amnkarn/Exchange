import PointStruct from "./PointStructureForExplorePage";

interface Info {
    headingLabel: string,
    heading: string,
    para: string,
    point1: string,
    point2: string,
    point3: string,
    point4?: string,
    tickBGColor: string
    tickColor: string
}

export default function SectionsInfo(props: Info) {
    return (
        <div className="w-full rounded-2xl shadow-lg shadow-gray-900">
            <div className="flex flex-col bg-[#111117] py-8 gap-5 ">
                <div className="px-3 py-1 w-fit rounded-2xl text-[10px] border border-gray-700" 
                style={{color: props.tickColor, backgroundColor: props.tickBGColor}} >
                    {props.headingLabel}
                </div>
                
                <div className="text-3xl text-white font-semibold">{props.heading}</div>

                <p className="text-gray-400 ">{props.para}</p>

                <div className="flex flex-col gap-2 pt-2">
                    <PointStruct point={props.point1} tickBGColor={props.tickBGColor} tickColor={props.tickColor} />
                    <PointStruct point={props.point2} tickBGColor={props.tickBGColor} tickColor={props.tickColor} />
                    <PointStruct point={props.point3} tickBGColor={props.tickBGColor} tickColor={props.tickColor} />
                    { props.point4 && 
                        <PointStruct point={props.point4} tickBGColor={props.tickBGColor} tickColor={props.tickColor} />
                    }
                </div>
            </div>
        </div>
    )
}