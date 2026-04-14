interface Order {
    price: number;
    quantity: number;
    orderId: string;
}
interface Bid extends Order {
    side: 'bid';
}
interface Ask extends Order {
    side: 'ask';
}
interface OrderBook {
    bids: Bid[];
    asks: Ask[];
}
export declare const orderbook: OrderBook;
export declare const bookWithQuantity: {
    bids: {
        [price: number]: number;
    };
    asks: {
        [price: number]: number;
    };
};
export {};
//# sourceMappingURL=order.d.ts.map