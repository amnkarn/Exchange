export interface Order {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;
    side: 'sell' | 'buy';
    userId: string;
}
export interface Fill {
    price: string;
    quantity: number;
    tradeId: number;
    otherUserId: string;
    markerOrderId: string;
}
export declare class Orderbook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string;
    latestTradeId: number;
    currentPrice: number;
    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrise: number);
    ticker(): string;
    getSnapshot(): {
        baseAsset: string;
        bids: Order[];
        asks: Order[];
        latestTradeId: number;
        thiscurrentPrice: number;
    };
    addOrder(order: Order): {
        executedQty: number;
        fills: Fill[];
    };
    matchBid(order: Order): {
        fills: Fill[];
        executedQty: number;
    };
    matchAsk(order: Order): {
        fills: Fill[];
        executedQty: number;
    };
    getDepth(): {
        bids: [string, string][];
        asks: [string, string][];
    };
    getOpenOrders(userId: string): Order[];
    cancelBid(order: Order): number | undefined;
    cancelAsk(order: Order): number | undefined;
}
//# sourceMappingURL=OrderBook.d.ts.map