import { BASE_CURRENCY } from "./Engine.js"

export interface Order {
    price: number
    quantity: number //original size
    orderId: string
    filled: number //progress
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
    bids: Order[]; //buyers
    asks: Order[]; //sellers
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
            const { executedQty, fills } = this.matchBid(order);
            order.filled = executedQty; //this is filled

            if(executedQty === order.quantity) { //if order is filled
                return {
                    executedQty,
                    fills
                }
            }

            if(order.filled < order.quantity) {
                this.bids.push(order);

                //sort bids(highest first)
                this.bids.sort((a, b) => (
                    b.price - a.price
                ))
            }
            
            return {
                executedQty,
                fills
            }

        } else { // order.side === 'sell'

            const { executedQty, fills } = this.matchBid(order);
            order.filled = executedQty;

            if(executedQty === order.quantity) { //all qty is filled
                return {
                    executedQty,
                    fills
                }
            }

            if(order.filled < order.quantity) {
                this.asks.push(order); //push remaining in asks

                this.asks.sort((a, b) => (
                    a.price - b.price
                ))
            }

            return {
                executedQty,
                fills
            }

        }
    }

    //match the buyer bid from orderbook
    matchBid(order: Order): { fills: Fill[], executedQty: number } {
        // here order = user want to buy this mush qty
        // ask = sellers
        
        const fills: Fill[] = []; //
        let executedQty = 0; //this mush qty is buyed by user


        for(let i = 0; i < this.asks.length; i++) { //match in all asks
            const ask = this.asks[i];
            if(!ask) continue;

            if(ask.price > order.price) break;
            if(executedQty === order.quantity) break;

            if(ask.price <= order.price && executedQty < order.quantity) {
                const remainingInOrder = order.quantity - executedQty; //still needs
                const remainingInAsks = ask.quantity - ask.filled; //seller have qty

                const fillQty = Math.min(remainingInOrder, remainingInAsks);

                executedQty += fillQty; //add
                ask.filled += fillQty;


                fills.push({
                    price: ask.price.toString(),
                    quantity: fillQty,
                    tradeId: this.latestTradeId++,
                    otherUserId: ask.userId,
                    markerOrderId: ask.orderId
                })
            }

        }
        
        //Keep asks where filled amount is less than total qty
        this.bids.filter(ask => ask.filled < ask.quantity);

        //for(let i=0; i < this.bids.length; i++) { //remove filled trades
        //    if(this.bids[i]?.filled === this.bids[i]?.quantity) {
        //        this.bids.splice(i, 1);
        //        i--;
        //    }
        //}

        return {
            fills,
            executedQty
        };
    }

    matchAsk(order: Order): {fills: Fill[], executedQty: number} {
        const fills: Fill[] = [];
        let executedQty = 0;

        for(let i = 0; i <this.bids.length; i++) { //match in all bids
            const bid = this.bids[i];
            if(!bid) continue;
            
            if(bid.price < order.price) break;
            if(executedQty === order.quantity) break;

            if(bid.price >= order.price && executedQty < order.quantity) {
                const remainingInOrder = order.quantity - executedQty; // still needs
                const remainingBids = bid.quantity - bid.filled; //buyer want

                const fillQty = Math.min(remainingInOrder, remainingBids);
                executedQty += fillQty;
                bid.filled += fillQty;

                fills.push({
                    price: bid.price.toString(),
                    quantity: fillQty,
                    tradeId: this.latestTradeId++,
                    otherUserId: bid.userId,
                    markerOrderId: bid.orderId,
                })
            }

        }

        this.asks.filter(bids => bids.filled < bids.quantity);

        return {
            fills,
            executedQty
        }
    }

    getDepth() {
        
    }

    getOpenOrders(userId: string): Order[] {
        const asks = this.asks.filter(x => x.userId === userId);
        const bids = this.bids.filter(x => x.userId === userId);

        return [...asks, ...bids];
    }

    cancelBid(order: Order) {
        const index = this.bids.findIndex(x => x.orderId === order.orderId); //find idx of order

        //if idx = -1, then it does not exist or already filled
        if(index !== -1) {
            const price = this.bids[index]?.price;

            this.bids.splice(index, 1);

            return price;
        }
    }

    cancelAsk(order: Order) {
        const index = this.asks.findIndex(x => x.orderId === order.orderId);

        if(index !== -1) {
            const price = this.asks[index]?.price;

            this.asks.splice(index, 1);

            return price;
        }
    }

}