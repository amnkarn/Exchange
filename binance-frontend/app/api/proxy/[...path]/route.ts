import { NextRequest, NextResponse } from "next/server";

const BINANCE_URL = "https://api.binance.com/api/v3";

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
    const path = (await params).path.join("/");
    const search = req.nextUrl.search;
    const response = await fetch(`${BINANCE_URL}/${path}${search}`);
    const data = await response.json();
    return NextResponse.json(data);
}