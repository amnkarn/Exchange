"use client";
import { useState } from "react";
import { BuyButton, CheckBoxInput, LimitButton, MarketButton, PersentButton, SellButton } from "./Buttons";

export function SwapUI({ market }: { market: string }) {
    const [amount, setAmount] = useState('');
    const [activeTab, setActiveTab] = useState('buy');
    const [type, setType] = useState('limit');
    const [quantity, setQuantity] = useState('');

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex flex-row h-15">
                    <BuyButton activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SellButton activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                
                <div className="flex flex-col gap-1">
                    <div className="px-3">
                        <div className="flex flex-row flex-0 gap-5 undefined">
                            <LimitButton type={type} setType={setType} />
                            <MarketButton type={type} setType={setType} />
                        </div>
                    </div>

                    <div className="flex flex-col px-3">
                        <div className="flex flex-col flex-1 gap-3 text-baseTextHighEmphasis">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between flex-row">
                                    <p className="text-xs font-normal text-baseTextMedEmphasis">Available Balance</p>
                                    <p className="font-medium text-xs text-baseTextHighEmphasis">36.94 USDC</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-xs font-normal text-baseTextMedEmphasis"> Price </p>
                                <div className="flex flex-col relative">
                                    <input
                                        step="0.01"
                                        placeholder="0"
                                        className="h-12 rounded-lg border-2 border-solid border-baseBorderLight bg-background pr-12 text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0"
                                        type="text"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />

                                    <div className="flex flex-row absolute right-1 top-1 p-2">
                                        <div className="relative">
                                            <img src="/usdc.webp" className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-normal text-baseTextMedEmphasis"> Quantity </p>
                            <div className="flex flex-col relative">
                                <input
                                    step="0.01"
                                    placeholder="0"
                                    className="h-12 rounded-lg border-2 border-solid border-baseBorderLight bg-background pr-12 text-right text-2xl leading-9 text-[$text] placeholder-baseTextMedEmphasis ring-0 transition focus:border-accentBlue focus:ring-0"
                                    type="text"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />

                                <div className="flex flex-row absolute right-1 top-1 p-2">
                                    <div className="relative">
                                        <img src="/sol.webp" className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end flex-row">
                                <p className="font-medium pr-2 text-xs text-baseTextMedEmphasis">≈ 0.00 USDC</p>
                            </div>

                            <div className="flex justify-center flex-row mt-2 gap-3">
                                <PersentButton persent="25%" />
                                <PersentButton persent="50%" />
                                <PersentButton persent="75%" />
                                <PersentButton persent="Max" />
                            </div>
                        </div>

                        <button type="button" className="font-semibold  focus:ring-blue-200 focus:none focus:outline-none text-center h-12 rounded-xl text-base px-4 py-2 my-4 bg-greenPrimaryButtonBackground text-greenPrimaryButtonText active:scale-98" data-rac="">
                            Buy
                        </button>

                        <div className="flex justify-between flex-row mt-1">
                            <div className="flex flex-row gap-2">
                                <div className="flex items-center">
                                    <CheckBoxInput id="postOnly" />
                                    <label className="ml-2 text-xs">Post Only</label>
                                </div>
                                <div className="flex items-center">
                                    <CheckBoxInput id="ioc" />
                                    <label className="ml-2 text-xs">IOC</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}