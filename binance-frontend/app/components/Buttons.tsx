import { Dispatch, SetStateAction } from "react"


export function LimitButton({ type, setType }: { type: string, setType: Dispatch<SetStateAction<string>> }) {
    return (
        <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('limit')}>
            <div className={`text-sm font-medium py-1 border-b-2 ${type === 'limit' ? "border-accentBlue text-baseTextHighEmphasis" : "border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"}`}>
                Limit
            </div>
        </div>
    )
}

export function MarketButton({ type, setType }: { type: string, setType: Dispatch<SetStateAction<string>> }) {
    return (
        <div className="flex flex-col cursor-pointer justify-center py-2" onClick={() => setType('market')}>
            <div className={`text-sm font-medium py-1 border-b-2 ${type === 'market' ? "border-accentBlue text-baseTextHighEmphasis" : "border-b-2 border-transparent text-baseTextMedEmphasis hover:border-baseTextHighEmphasis hover:text-baseTextHighEmphasis"} `}>
                Market
            </div>
        </div>
    )
}

export function BuyButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: Dispatch<SetStateAction<string>> }) {
    return (
        <div className={`flex flex-col -mb-0.5 flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === 'buy' ? 'border-b-greenBorder bg-greenBackgroundTransparent' : 'border-b-baseBorderMed hover:border-b-baseBorderFocus'}`} onClick={() => setActiveTab('buy')}>
            <p className="text-center text-sm font-semibold text-green-500">
                Buy
            </p>
        </div>
    )
}

export function SellButton({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: Dispatch<SetStateAction<string>> }) {
    return (
        <div className={`flex flex-col -mb-0.5 flex-1 cursor-pointer justify-center border-b-2 p-4 ${activeTab === 'sell' ? 'border-b-redBorder bg-redBackgroundTransparent' : 'border-b-baseBorderMed hover:border-b-baseBorderFocus'}`} onClick={() => setActiveTab('sell')}>
            <p className="text-center text-sm font-semibold text-redText">
                Sell
            </p>
        </div>
    )
}

export function PersentButton({ persent }: { persent: string }) {
    return (
        <div className="flex items-center justify-center flex-row rounded-full px-4 py-1.5 text-xs cursor-pointer bg-baseBackgroundL2  hover:bg-green-400 hover:text-black">
            { persent }
        </div>
    )
}


export function CheckBoxInput({id}: {id: string}) {
    return (
        <input
            className="form-checkbox rounded border border-solid border-baseBorderMed bg-base-950 font-light text-transparent shadow-none shadow-transparent outline-none ring-0 ring-transparent checked:border-baseBorderMed checked:bg-base-900 checked:hover:border-baseBorderMed focus:bg-base-900 focus:ring-0 focus:ring-offset-0 focus:checked:border-baseBorderMed cursor-pointer h-5 w-5"
            id={id}
            type="checkbox"
        />
    )
}

export default function ChartTopButton({name, onClick, isActive}: {name: string, onClick?: any, isActive?: boolean}) {
    return (
        <button className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${isActive ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`} onClick={onClick}> 
            {name}
        </button>
    )
}