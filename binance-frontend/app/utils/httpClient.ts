import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types"; //types

const BASE_URL = "/api/proxy";

// SOL_USDC -> SOLUSDC (Binance format)
const toSymbol = (market: string) => market.replace("_", "");

// get 24hr data for a single stock
export async function getTicker(market: string): Promise<Ticker> {
    const response = await axios.get(`${BASE_URL}/ticker/24hr?symbol=${toSymbol(market)}`);
    const data = response.data;

    // returned after destructuring
    return {
        firstPrice: String(parseFloat(data.openPrice)),
        high: String(parseFloat(data.highPrice)),
        low: String(parseFloat(data.lowPrice)),
        lastPrice: String(parseFloat(data.lastPrice)),
        priceChange: String(parseFloat(data.priceChange)),
        priceChangePercent: String(parseFloat(data.priceChangePercent)),
        quoteVolume: String(parseFloat(data.quoteVolume)),
        symbol: data.symbol,
        trades: data.count,
        volume: String(parseFloat(data.volume)),
    };
}

// fetch all stocks data to show
export async function getTickers(): Promise<Ticker[]> {
    const response = await axios.get(`${BASE_URL}/ticker/24hr`);
    return response.data.map((data: any) => ({
        firstPrice: String(parseFloat(data.openPrice)),
        high: String(parseFloat(data.highPrice)),
        low: String(parseFloat(data.lowPrice)),
        lastPrice: String(parseFloat(data.lastPrice)),
        priceChange: String(parseFloat(data.priceChange)),
        priceChangePercent: String(parseFloat(data.priceChangePercent)),
        quoteVolume: String(parseFloat(data.quoteVolume)),
        symbol: data.symbol,
        trades: data.count,
        volume: String(parseFloat(data.volume)),
    }));
}

// Fetches the "Order Book", bids[] & asks[]
export async function getDepth(market: string): Promise<Depth> {
    const response = await axios.get(`${BASE_URL}/depth?symbol=${toSymbol(market)}&limit=20`);
    return response.data;
}

// to show the successful trades "History"
export async function getTrades(market: string): Promise<Trade[]> {
    const response = await axios.get(`${BASE_URL}/trades?symbol=${toSymbol(market)}&limit=50`);
    return response.data.map((t: any) => ({
        id: t.id,
        price: String(parseFloat(t.price)),
        quantity: String(parseFloat(t.qty)),
        timestamp: t.time,
        isBuyerMaker: t.isBuyerMaker,
    }));
}

// fetch "Candlestick" data, to generate chart
export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {
    const response = await axios.get(`${BASE_URL}/klines?symbol=${toSymbol(market)}&interval=${interval}&startTime=${startTime * 1000}&endTime=${endTime * 1000}`);
    
    return response.data.map((x: any[]) => ({
        open: x[1],
        high: x[2],
        low: x[3],
        close: x[4],
        volume: x[5],
        start: x[0],   // open time (ms)
        end: x[6],     // close time (ms)
    }));
}

//  Fetches all trading pairs currently available and filters out that are "TRADING" (active).
export async function getMarkets(): Promise<string[]> {
    const response = await axios.get(`${BASE_URL}/exchangeInfo`);
    return response.data.symbols
        .filter((s: any) => s.status === "TRADING")
        .map((s: any) => s.symbol);
}