import { useEffect, useState } from "react";

export default function HeroSection() {
    const [idx, setIdx] = useState(0);

    const banners = [
        {
            img: "../../../market/1.webp",
            heading: "PAXG Yield Boost is Live",
            para: "Trade to unlock up to 30% APY on lent PAXG — still usable as collateral.",
            button: "PAXG Yield Boost"
        }, {
            img: "../../../market/2.webp",
            heading: "BP Trading is Live",
            para: "Own BP. Your key to maximum benefits in the Backpack ecosystem.",
            button: "Buy BP Now"
        }, {
            img: "../../../market/3.webp",
            heading: "Access IPOs Onchain",
            para: "Real shares. Direct ownership. On Solana.",
            button: "Join the Waitlist"
        }, {

            img: "../../../market/4.webp",
            heading: "Earn 12.96% APY on your MON collateral",
            para: "Lend MON to earn staking yield + lending yield, and use as collateral.",
            button: "Lend Mon"
        }, {
            img: "../../../market/5.webp",
            heading: "Lend USD. Earn 4.25% APY. Get points.",
            para: "Lend USD to start earning high yield while using as collateral for trading.",
            button: "Lend USD"
        }, {
            img: "../../../market/6.webp",
            heading: "Earn 4.93% APY on your SOL collateral",
            para: "Lend SOL to earn staking yield + lending yield, and use as collateral.",
            button: "Lend SOL"
        }, {
            img: "../../../market/7.webp",
            heading: "Got USDT",
            para: "Convert to USD with 0 fees and start trading on Backpack!",
            button: "Trade USDT"
        }, {
            img: "../../../market/8.webp",
            heading: "Refer and Earn",
            para: "Refer a friend and earn a percentage of their trading fees.",
            button: "Manage Referrals"
        }, {
            img: "../../../market/9.webp",
            heading: "Wire Transfers are Live",
            para: "Deposit and withdraw USD. Stake BP or trade for more free wires*."
        }
    ]
    const total = banners.length;

    useEffect(() => {
        const interval = setInterval(() => {
            setIdx((prev) => {
                return (prev + 1) % total
            })
        }, 3000)

        return () => clearInterval(interval);

    }, [])

    function prevSlide() {
        if (idx === 0) setIdx(total);
        setIdx((prev) => prev - 1);
    }

    function nextSlide() {
        if (idx === total - 1) setIdx(0);
        setIdx((prev) => prev + 1);
    }

    return (
        <HeroImg
            img={banners[idx].img}
            heading={banners[idx].heading}
            para={banners[idx].para}
            button={banners[idx].button || ""}
            onPrev={prevSlide}
            onNext={nextSlide}
            idx={idx}
            length={total}
            setIdx={(i) => setIdx(i)}
        />
    )
}

interface HeroImg {
    img: string,
    heading: string,
    para: string,
    button: string,
    onPrev: () => void,
    onNext: () => void
    length: number,
    idx: number,
    setIdx: (i: number) => void,
}

function HeroImg({ img, heading, para, button, onPrev, onNext, idx, length, setIdx }: HeroImg) {
    return (
        <div className="w-[90%] place-self-center px-20 rounded-2xl relative">
            <div className="relative border-2 border-gray-900">
                <span
                    className="material-symbols-outlined absolute top-[45%] left-5 text-3xl! text-gray-400 cursor-pointer"
                    onClick={onPrev}
                >
                    arrow_back_ios
                </span>

                <img src={img} alt="HeroImg" className="w-full h-[20]% rounded-2xl" />

                <span
                    className="material-symbols-outlined absolute top-[45%] right-0 text-3xl! text-gray-400 cursor-pointer"
                    onClick={onNext}
                >
                    arrow_forward_ios
                </span>
            </div>

            <div className="absolute top-25 left-30 flex flex-col px-10 gap">
                <h1 className="text-[40px] font-bold">{heading}</h1>
                <h5 className="text-lg text-gray-400">{para}</h5>

                {button &&
                    <div className="text-black font-medium px-5 py-3 mt-3 bg-white rounded-xl w-fit cursor-pointer">
                        {button}
                    </div>
                }
            </div>

            <div className="absolute bottom-5 left-[43%] flex items-center gap-2">
                {Array.from({ length }).map((_, i) => (
                    <Dot key={i} dotIdx={i} activeIdx={idx} setIdx={setIdx} />
                ))}
            </div>
        </div>
    )
}

function Dot({ dotIdx, activeIdx, setIdx }: {
    dotIdx: number;
    activeIdx: number;
    setIdx: (i: number) => void;
}) {
    return (
        <div className={`w-2 h-2 rounded-full cursor-pointer transition-colors 
            ${dotIdx === activeIdx ? "bg-white" : "bg-gray-400 hover:bg-white"}`}
            onClick={() => setIdx(dotIdx)}
        />
    )
}