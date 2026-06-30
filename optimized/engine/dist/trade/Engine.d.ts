import { type MessageFromApi } from "../types/fromApi.js";
import { type Fill, type Order } from "./OrderBook.js";
export declare const BASE_CURRENCY = "INR";
export declare class Engine {
    private orderBooks;
    private balances;
    constructor();
    saveSnapShot(): void;
    process({ clientId, message }: {
        clientId: string;
        message: MessageFromApi;
    }): void;
    createOrder(market: string, price: string, quantity: string, side: "buy" | "sell", userId: string): {
        executedQty: number;
        fills: Fill[];
        orderId: string;
    };
    updateDbOrders(order: Order, executedQty: number, fills: Fill[], market: string): void;
    createDbTrades(fills: Fill[], market: string, userId: string): void;
    publishWsTrades(fills: Fill[], userId: string, market: string): void;
    sendUpdatedDepthAt(price: string, market: string): void;
    publishWsDepthUpdates(fills: Fill[], price: string, side: "buy" | "sell", market: string): void;
    updateBalance(userId: string, baseAseet: string, quoteAsset: string, side: "buy" | "sell", fills: Fill[], executedQty: number): void;
    checkAndLockFunds(baseAsset: string, quoteAsset: string, side: "buy" | "sell", userId: string, price: string, quantity: string): void;
    onRamp(userId: string, amount: number): void;
    private getAssetBalance;
    setBaseBalances(): void;
}
//# sourceMappingURL=Engine.d.ts.map