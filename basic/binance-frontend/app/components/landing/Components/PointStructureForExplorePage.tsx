

export default function PointStruct({point, tickBGColor, tickColor}: {point?: string, tickBGColor: string, tickColor: string}) {
    return (
        <div className="flex gap-2 items-center">
            <span 
                className={`material-symbols-outlined p-0.5 w-fit rounded-full text-[16px]!  font-semibold`}
                style={{backgroundColor: tickBGColor, color: tickColor}}    
            >
                check_small
            </span>

            <p className="text-[14px]">{point}</p>
        </div>
    )
}