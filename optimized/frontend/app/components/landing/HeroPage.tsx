

export function HeroPage() {
    return (
        <div className="flex flex-col items-center justify-center py-4 ">
            <div className="flex flex-col items-center justify-center mt-20 w-[40%]">
                <h1 className="text-[71px] font-[600] font-interFam text-white tracking-tight">
                    Modern <span className="text-[#FD4B4E]">finance</span>.
                </h1>

                <p className="text-[#939CAC] text-[20px] pt-5 px-14 text-center text-base/relaxed">
                    Your brokerage, your bank, your exchange. Trade, borrow, spend, and earn in the most powerful margin account in finance.
                </p>

                <div className="w-full px-12 mt-8">
                    <div className="flex items-center justify-between border border-gray-800 p-1 rounded-full overflow-hidden py-1 bg-[#14151B] transition-all focus-within:ring-1 focus-within:ring-gray-400">
                        <input type="text" placeholder="Enter your email"
                            className="outline-none ml-5 flex-1 bg-transparent text-white text-sm"
                        />
                        <button className="bg-white text-black font-medium rounded-full px-6 inline text-sm transition-hover hover:bg-gray-200 py-2.5">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-[68%] mt-15">
                <img src="https://backpack.exchange/new-home/marketing-hero-spot-dark.png" alt="Hero" className="object-cover rounded-2xl " />
            </div>
        </div>
    )
}