import { NextRequest, NextResponse } from "next/server";

// we'll call our own local proxy server, bcs browser blocks direct api call to external api

const BINANCE_URL = "https://api.binance.com/api/v3";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = (await params).path.join("/"); // add '/' in starting

    const search = req.nextUrl.search; //capture query parameter '?symbol=BTCUSDT'
    
    const response = await fetch(`${BINANCE_URL}/${path}${search}`);
    if(!response.ok) {
        return console.log("Error in binance api");
    }
    const data = await response.json();
    return NextResponse.json(data);
}