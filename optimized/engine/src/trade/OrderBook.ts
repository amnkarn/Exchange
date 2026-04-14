import { BASE_CURRENCY } from "./Engine.js"

export interface Order {
    price: number
    quantity: number
    orderId: string
    filled: number
    side: 'sell' | 'buy'
    userId: string
}

export interface Fill {
    price: string
    quantity: number
    tradeId: number
    otherUserId: string
    markerOrderId: string
}

export class Orderbook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    latestTradeId: number;
    currentPrice: number;

    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrise: number) {
        this.asks = asks;
        this.bids = bids;
        this.baseAsset = baseAsset;
        this.latestTradeId = lastTradeId || 0;
        this.currentPrice = currentPrise || 0;
    }

    ticker() {
        return `${this.baseAsset}_${this.quoteAsset}`;
    }

    getSnapshot() {
        return {
            baseAsset: this.baseAsset,
            bids: this.bids,
            asks: this.asks,
            latestTradeId: this.latestTradeId,
            thiscurrentPrice: this.currentPrice
        }
    }

    addOrder(order: Order): { executedQty: number, fills: Fill[] } {

        if (order.side === 'buy') {
            const {executedQty, fills} = this.matchBid(order);
            order.filled = executedQty;
            if(executedQty === order.quantity) {
                return {
                    executedQty,
                    fills
                }
            }

            this.bids.push(order);
            return {
                executedQty,
                fills
            }

        } else {
            const { executedQty, fills } = this.matchBid(order);
            order.filled = executedQty;
            if(executedQty === order.filled) {
                return {
                    executedQty,
                    fills
                }
            }

            this.bids.push(order);

            return {
                executedQty,
                fills
            }

        }
    }

    matchBid(order: Order): { fills: Fill[], executedQty: number } {
        const fills: Fill[] = [];
        let executedQty = 0;


        for(let i = 0; i < this.asks.length - 1; i++) {
            const ask = this.asks[i];

            if((ask?.price as number) <= order.price && executedQty < order.quantity) {
                const remainingInOrder = order.quantity - executedQty;
                const remainingInAsks = (ask?.quantity as number) - (ask?.filled as number);
                const fillQty = Math.min(remainingInOrder, remainingInAsks);

                executedQty += fillQty;
                ask?.filled += fillQty;

                
                fills.push({
                    price: ask.price.toString(),
                    quantity: fillQty,
                    tradeId: this.latestTradeId,
                    otherUserId: ask?.userId,
                    markerOrderId: ask?.orderId
                })
            }

            this.asks = this.asks.filter(ask => ask.filled < ask.quantity);
            return { fills, executedQty };
        }

        return {
            fills,
            executedQty
        }
    }

}