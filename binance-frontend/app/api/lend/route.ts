import { NextRequest, NextResponse } from "next/server";


const BINANCE_URL = "https://api.backpack.exchange/api/v1/borrowLend/markets"; //15 stoks data

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const response = await fetch(`${BINANCE_URL}`);
    if(!response.ok) {
        return console.log("Error in binance api");
    }
    const data = await response.json();
    return NextResponse.json(data);
}