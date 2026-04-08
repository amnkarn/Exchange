import SectionsInfo from "./SectionInfo"


export default 
function Sec3() {
    return (
        <div className="w-full my-30 flex items-center justify-center gap-10">
            <div className="w-[35%] mr-5">
                <AccountOverview />
            </div>

            <div className="w-[35%]">
                <SectionsInfo
                    headingLabel="Strategy Isolation"
                    heading="Isolated subaccounts. One login, infinite strategies."
                    para="Run multiple trading strategies without interference. Each subaccount has its own margin, positions, and risk parameters. Perfect for traders who separate spot, perps, and yield farming."
                    point1="Separate margin pools per strategy"
                    point2="Independent risk parameters"
                    point3="No cross-contamination between accounts"
                    tickBGColor="#1F1A32"
                    tickColor="#B097DF"
                />
            </div>
        </div>
    )
}


function AccountOverview() {
    return (
        <div className="w-full px-22 flex flex-col">
            <div className="border border-gray-700 rounded-xl pb-5">
                
                <div className="flex gap-5 py-5 px-6 items-center border-b border-gray-800">
                    <span className="material-symbols-outlined">person</span>
                    <div className="flex flex-col ">
                        <h4 className="text-sm ">Satoshi N.</h4>
                        <p className="text-gray-400 text-xs">sat***@****</p>
                    </div>
                </div>

                <div className="px-3 pt-2">
                    <div className="flex items-center justify-between text-sm">
                        <h5 className="text-white">Tranding Accounts</h5>
                        <span className="material-symbols-outlined text-gray-400">add</span>
                    </div>

                    <div className="">
                        <div className="flex gap-4">
                            <AccountOverviewDiv
                                logo="M"
                                heading="Main"
                                volume="$12,450.32"
                            />
                            <AccountOverviewDiv
                                logo="P"
                                heading="Perps"
                                volume="$8,271.50"
                            />
                        </div>

                        <AccountOverviewDiv
                            logo="M"
                            heading="Margin"
                            volume="$3,890.00"
                        />

                        <div className="flex items-center justify-between px-5 py-2">
                            <h5 className="text-sm">Bot Accounts</h5>
                            <span className="material-symbols-outlined text-gray-400
                            ">add</span>
                        </div>

                        <div className="flex gap-4">
                            <AccountOverviewDiv
                                logo="S"
                                heading="SOL Grid"
                                volume="$2,150.75"
                            />
                            <AccountOverviewDiv
                                logo="P"
                                heading="Perps Grid"
                                volume="$5,430.00"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AccountOverviewDiv({logo, heading, volume}: {logo: string, heading: string, volume: string}) {
    return (
        <div className="w-fit bg-[#14151b] rounded-xl my-2 pt-2 hover:bg-[#171920] border border-gray-800 cursor-pointer">
            <div className="flex items-center justify-between px-3">
                <div className="p-1.5 px-2.5 bg-amber-950 rounded-full text-sm">{logo}</div>
                <span className="material-symbols-outlined text-gray-400 text-sm">more_vert</span>
            </div>

            <div className="flex items-center justify-center gap-12 px-3 py-2">
                <div className="flex flex-col">
                    <h5 className="text-xs">{heading}</h5>
                    <p className="text-xs text-gray-400 pt-1">{volume}</p>
                </div>

                <div className="p-2 rounded-full border-3 border-t-green-500"></div>
            </div>
        </div>
    )
}