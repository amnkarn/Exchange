import { NextRequest, NextResponse } from "next/server";


const BINANCE_URL = "https://api.backpack.exchange/api/v1/borrowLend/markets"; //15 stoks data

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const response = await fetch(`${BINANCE_URL}`);
        if (!response.ok) {
            return console.log("Error in binance api");
        }
        const data = await response.json();
        //console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
    }
}