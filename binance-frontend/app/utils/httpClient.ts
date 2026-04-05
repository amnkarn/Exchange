import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

//const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";

//export async function getTicker(market: string): Promise<Ticker> {
//    const response = await axios.get(`${BASE_URL}/tickers`);
//    return response.data;
//}

//export async function getTickers(): Promise<number> {
//    await new Promise(resolve => setTimeout(resolve, 1000));
//    return 1;
//}

//export async function getDepth(market: string): Promise<Depth> {
//    const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
//    return response.data;
//}

//export async function getTrades(market: string): Promise<Trade[]> {
//    const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
//    return response.data;
//}

//export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {

//    const response = await axios.get(`${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
//    const data: KLine[] = response.data;
//    return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
//}

//export async function getMarkets(): Promise<string[]> {
//    const response = await axios.get(`${BASE_URL}/markets`);
//    return response.data;
//}


const BASE_URL = "/api/proxy";

// SOL_USDC -> SOLUSDC (Binance format)
const toSymbol = (market: string) => market.replace("_", "");

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

export async function getDepth(market: string): Promise<Depth> {
    const response = await axios.get(`${BASE_URL}/depth?symbol=${toSymbol(market)}&limit=20`);
    return response.data;
}

export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {
    const response = await axios.get(`${BASE_URL}/klines?symbol=${toSymbol(market)}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
    return response.data;
}