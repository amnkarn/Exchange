

export default function Sec2Box() {
    return (
        <div className="w-full px-10">
            <div className="px-5 py-8 bg-[#14151B] rounded-2xl">
                <div className="flex gap-3">
                    <h4 className="font-semibold text-sm">Cross Margin Overview</h4>
                    <span className="material-symbols-outlined text-[20px]! text-gray-400">info</span>
                </div>

                <div className="flex flex-col gap-3 mt-5">
                    <OverviewWithProgressBar
                        title="Initial Margin"
                        progressWidth={35}
                        progress="24%"
                    />

                    <OverviewWithProgressBar
                        title="Maintenance Margin"
                        progressWidth={25}
                        progress="18%"
                    />
                </div>

                <div className="flex flex-col gap-2 mt-5">
                    <OverviewWithDets
                        title="Equity Total"
                        value="$42,580.50"
                    />
                    <OverviewWithDets
                        title="Equity Available"
                        value="$38,240.00"
                    />
                    <OverviewWithDets
                        title="Open PnL"
                        value="+$1,240.50"
                        textColor={true}
                    />
                    <OverviewWithDets
                        title="Portfolio APY"
                        value="4.31%"
                    />
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">Account Leverage Limit</p>
                        <h4 className="text-xs font-semibold px-4 py-1.5 bg-[#202127] rounded-lg">10x</h4>
                    </div>

                    <div className="flex flex-col px-2 pt-3">
                        <input type="range" defaultValue={20} className="appearance-none bg-gray-700 rounded-lg h-1 cursor-pointer accent-accentBlue" />

                        <div className="flex items-center justify-between pt-1">
                            <p className="text-xs text-gray-500">1x</p>
                            <p className="text-xs text-gray-500">75x</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface ReportBar {title: string, progressWidth: number, progress: string}

function OverviewWithProgressBar(props: ReportBar) {
    return (
        <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{props.title}</p>

            <div className="flex gap-4 items-center">
                <div className="w-30 h-2 rounded-2xl bg-baseBorderLight">
                    <div className={`h-1.5 rounded-l-2xl bg-[#00C278]`} style={{width: props.progressWidth}} ></div>
                </div>
                <p className="text-xs text-white">{props.progress}</p>
            </div>
        </div>
    )
}

function OverviewWithDets({title, value, textColor}: {title: string, value: string, textColor?: boolean}) {
    return (
        <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{title}</p>
            <p className={`text-xs ${textColor ? "text-green-500" : "text-white"} `}>{value}</p>
        </div>
    )
}