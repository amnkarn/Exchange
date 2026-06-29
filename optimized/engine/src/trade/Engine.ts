import { RedisManager } from "../ReadisManager.js";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, ON_RAMP, type MessageFromApi } from "../types/fromApi.js";
import { Orderbook, type Fill, type Order } from "./OrderBook.js";
import fs from "fs"

export const BASE_CURRENCY = "INR";

interface UserBalance {
    [key: string]: {
        available: number,
        locked: number,
    }
}

export class Engine {
    private orderBooks: Orderbook[] = [];
    private balances: Map<string, UserBalance> = new Map(); //a new map, to store all balances


    constructor() {
        let snapshot = null;

        try {
            if (process.env.WITH_SNAPSHOT!) {
                snapshot = fs.readFileSync("./snapshot.json"); //read the file
            }
        } catch (error) {
            console.log("No snapshot found", error);
        }

        if (snapshot) { //CRASH RECOVERY
            const snapShotSNAP = JSON.parse(snapshot.toString());

            this.orderBooks = snapShotSNAP.orderbooks.map((snapOB: any) => (
                new Orderbook(snapOB.baseAsset, snapOB.bids, snapOB.asks, snapOB.lastTradeId, snapOB.currentPrice
            )))

            this.balances = new Map(snapShotSNAP.balances);

        } else { //FRESH START
            //create a fake orderBook
            this.orderBooks = [new Orderbook(`TATA`, [], [], 0, 0)];
            this.setBaseBalances();
        }

        setInterval(() => {
            this.saveSnapShot();
        }, 1000 * 3)
    }

    saveSnapShot() {
        const snapshotSnapshot = {
            orderbooks: this.orderBooks.map(o => o.getSnapshot()),
            balances: Array.from(this.balances.entries()), // Map → Array (to save in JSON)
        }

        fs.writeFile("./snapshot.json", JSON.stringify(snapshotSnapshot), () => {
            console.log("Snapshot is being saved")
        });
    }
    

    process({ clientId, message }: { clientId: string, message: MessageFromApi}) {
        switch(message.type) {
            case CREATE_ORDER: 
                try {
                    const { executedQty, fills, orderId } = this.createOrder(message.data.market, message.data.price, message.data.quantity, message.data.side, message.data.userId);
                    
                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "ORDER_PLACED",
                        payload: {
                            orderId,
                            executedQty,
                            fills
                        }
                    })
                } catch (error) { //for any reason(insufficient fund), order is cancelled
                    console.log(error);
                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId: "",
                            executedQty: 0,
                            remainingQty: 0
                        }
                    })
                }
                break;
            
            case CANCEL_ORDER: 
                try {
                    const orderId = message.data.orderId;
                    const cancelMarket = message.data.market;
                    const cancelOrderbook = this.orderBooks.find(o => {
                        o.ticker() === cancelMarket
                    })
                    if(!cancelOrderbook) {
                        throw new Error("No Orderbook found");
                    }
                    const quoteAsset = cancelMarket.split("_")[1];

                    const order = cancelOrderbook.asks.find(o => o.orderId === orderId) || 
                                cancelOrderbook.bids.find(o => o.orderId === orderId);

                    if(!order) {
                        console.log("No order found");
                        throw new Error("No order found");
                    }

                    if(order.side === "buy") {
                        const price = cancelOrderbook.cancelBid(order);
                        const leftQuantity = (order.quantity - order.filled) - order.price;
                        
                        //@ts-ignore
                        this.balances.get(order.userId)[BASE_CURRENCY].available += leftQuantity;
                        //@ts-ignore
                        this.balances.get(order.userId)[BASE_CURRENCY].locked -= leftQuantity;
                    
                        if(price) {
                            this.sendUpdatedDepthAt(price.toString(), cancelMarket);
                        }
                        
                    } else { //"sell"
                        const price = cancelOrderbook.cancelAsk(order);
                        const leftQuantity = order.quantity - order.filled;
                        //@ts-ignore
                        this.balances.get(order.userId)[quoteAsset].available += leftQuantity;
                        
                        //@ts-ignore
                        this.balances.get(order.userId)[quoteAsset].locked -= leftQuantity;

                        if(price) {
                            this.sendUpdatedDepthAt(price.toString(), cancelMarket);
                        }
                    }

                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId,
                            executedQty: 0,
                            remainingQty: 0,
                        }
                    })

                } catch (error) {
                    console.log("Error while canceling order");
                    console.log(error);
                }

                break;

            case GET_OPEN_ORDERS: 
                try {
                    const openOrderBook = this.orderBooks.find(o => o.ticker() === message.data.market);
                    if(!openOrderBook) {
                        throw new Error("No orderbook found");
                    }

                    const openOrders = openOrderBook.getOpenOrders(message.data.userId);

                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "OPEN_ORDERS",
                        payload: openOrders,
                    })

                } catch (error) {
                    console.log(error);
                }

                break;

            case ON_RAMP:
                const userId = message.data.userId;
                const amount = Number(message.data.amount);
                this.onRamp(userId, amount);
                break;

            case GET_DEPTH:
                try {
                    const market = message.data.market;
                    const orderBook = this.orderBooks.find(o => o.ticker() === market);
                    if(!orderBook) {
                        throw new Error("No order book found");
                    }

                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: orderBook.getDepth(),
                    })

                } catch (error) {
                    console.log(error);
                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: {
                            bids: [],
                            asks: [],
                        }
                    })
                }

                break;
        }
    }

    addOrderBook(orderBook: Orderbook) {
        this.orderBooks.push(orderBook);
    }

    createOrder(market: string, price: string, quantity: string, side: "buy" | "sell", userId: string) {
        const orderbook = this.orderBooks.find(o => o.ticker() === market);
        if(!orderbook) {
            throw new Error("No orderbook found");
        }
        const baseAsset = market.split("_")[0];
        const quoteAsset = market.split("_")[1];
        
        this.checkAndLockFunds(baseAsset!, quoteAsset!, side, userId, quoteAsset!, price, quantity);

        const order: Order = {
            price: Number(price),
            quantity: Number(quantity),
            orderId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            filled: 0,
            side,
            userId,
        }

        const { executedQty, fills } = orderbook.addOrder(order);
        this.updateBalance(userId, baseAsset!, quoteAsset!, side, fills, executedQty);

        this.createDbTrades(fills, market, userId);
        this.updateDbOrders(order, executedQty, fills, market);
        this.publishWsDepthUpdates(fills, price, side, market);
        this.publishWsTrades(fills, userId, market);

        return { executedQty, fills, orderId: order.orderId };
    }

    updateDbOrders(order: Order, executedQty: number, fills: Fill[], market: string) {
        RedisManager.getInstanse().pushMessage({
            type: "ORDER_UPDATE",
            data: {
                orderId: order.orderId,
                executedQty: executedQty,
                market: market,
                price: order.price.toString(),
                quantity: order.quantity.toString(),
                side: order.side,
            }
        })

        fills.forEach(fill => {
            RedisManager.getInstanse().pushMessage({
                type: "ORDER_UPDATE",
                data: {
                    orderId: fill.markerOrderId,
                    executedQty: fill.quantity,
                }
            })
        })
    }

    createDbTrades(fills: Fill[], market: string, userId: string) {
        fills.forEach(fill => {
            RedisManager.getInstanse().pushMessage({
                type: "TRADE_ADDED",
                data: {
                    market: market,
                    id: fill.tradeId.toString(),
                    isBuyerMaker: fill.otherUserId === userId,
                    price: fill.price,
                    quantity: fill.quantity.toString(),
                    quoteQuantity: (fill.quantity * Number(fill.price)).toString(),
                    timestamp: Date.now(),
                }
            })
        })
    }

    publishWsTrades(fills: Fill[], userId: string, market: string) {
        fills.forEach(fill => {
            RedisManager.getInstanse().publishMessage(`trade@${market}`, {
                stream: `trade@${market}`,
                data: {
                    e: "trade",
                    t: fill.tradeId,
                    m: fill.otherUserId === userId,
                    p: fill.price,
                    q: fill.quantity.toString(),
                    s: market,
                }
            })
        })
    }

    sendUpdatedDepthAt(price: string, market: string) {
        const orderbook = this.orderBooks.find(ob => ob.ticker() === market);
        if(!orderbook) {
            return;
        }

        const depth = orderbook.getDepth();
        const updateBids = depth.bids.filter(x => x[0] === price);
        const updateAsks = depth.asks.filter(x => x[0] === price);

        RedisManager.getInstanse().publishMessage(`depth@${market}`, {
            stream: `depth@${market}`,
            data: {
                a: updateAsks.length ? updateAsks : [[price, "0"]],
                b: updateBids.length ? updateBids : [[price, "0"]],
                e: "depth"
            }
        })
    }

    publishWsDepthUpdates(fills: Fill[], price: string, side: "buy" | "sell", market: string) {
        const orderBook = this.orderBooks.find(o => o.ticker() === market);
        if(!orderBook) return;
        const depth = orderBook.getDepth();

        if(side === "buy") {
            const updateAsks = depth.asks.filter((x) => {
                fills.map(f => f.price).includes(x[0].toString());
            })
            const updateBids = depth.bids.find(x => x[0] === price);
            console.log("publish ws depth updates");

            RedisManager.getInstanse().publishMessage(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updateAsks,
                    b: updateBids ? [updateBids] : [],
                    e: "depth"
                }
            })
        }

        if(side === "sell") {
            const updateBids = depth.bids.filter((x) => {
                fills.map(f => f.price).includes(x[0].toString());
            })
            const updateAsk = depth.asks.find(x => x[0] === price);
            console.log("publish ws depth updates");

            RedisManager.getInstanse().publishMessage(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updateAsk ? [updateAsk] : [],
                    b: updateBids,
                    e: "depth"
                }
            })
        }
    }

    updateBalance(userId: string, baseAseet: string, quoteAsset: string, side: "buy" | "sell", fills: Fill[], executedQty: number) {
        if(side === "buy") {
            fills.forEach(fill => {
                //Update quote asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset]?.available = this.balances.get(fill.otherUserId)[quoteAsset]?.available + (fill.quantity * fill.price);
            
                //@ts-ignore
                this.balances.get(userId)[quoteAsset]?.locked = this.balances.get(userId)[quoteAsset]?.locked - (fill.quantity * fill.price);

                //Update base asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAseet]?.locked = this.balances.get(fill.otherUserId)[baseAseet]?.locked - fill.quantity;

                //@ts-ignore
                this.balances.get(userId)[baseAseet]?.available = this.balances.get(userId)[baseAseet]?.available + fill.quantity;
            })

        } else { //"sell"
            fills.forEach(fill => {
                //update quote asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset]?.locked = this.balances.get(fill.otherUserId)[quoteAsset]?.locked - (fill.quantity * fill.price);
            
                //@ts-ignore
                this.balances.get(userId)[quoteAsset]?.available = this.balances.get(userId)[quoteAsset]?.available + (fill.quantity * fill.price);
            
                // Update base asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAseet]?.available = this.balances.get(fill.otherUserId)[baseAseet]?.available + fill.quantity;

                //@ts-ignore
                this.balances.get(userId)[baseAseet]?.locked = this.balances.get(userId)[baseAseet]?.locked - (fill.quantity);
            })
        }
    }

    checkAndLockFunds(baseAsset: string, quoteAsset: string, side: "buy" | "sell", userId: string, asset: string, price: string, quantity: string) {
        if(side === "buy") {
            if((this.balances.get(userId)?.[quoteAsset]?.available || 0) < Number(quantity) * Number(price)) {
                throw new Error("Insufficient fund");
            }

            //@ts-ignore
            this.balances.get(userId)[quoteAsset]?.available = this.balances.get(userId)[quoteAsset]?.available - (Number(quantity) * Number(price))

            //@ts-ignore
            this.balances.get(userId)[quoteAsset]?.locked = this.balances.get(userId)[quoteAsset]?.locked + (Number(price) * Number(quantity))
        
        } else { //"sell"
            if((this.balances.get(userId)?.[quoteAsset]?.available || 0) < Number(quantity)) {
                throw new Error("Insufficient fund");
            }

            //@ts-ignore
            this.balances.get(userId)[baseAsset]?.available = this.balances.get(userId)[baseAsset]?.available - Number(quantity);
        
            //@ts-ignore
            this.balances.get(userId)[baseAsset]?.locked = this.balances.get(userId)[baseAsset]?.locked + Number(quantity);
        }
    }

    onRamp(userId: string, amount: number) {
        const userBalance = this.balances.get(userId);
        if(!userBalance) {
            this.balances.set(userId, {
                [BASE_CURRENCY]: {
                    available: amount,
                    locked: 0,
                }
            })
        } else {
            //@ts-ignore
            userBalance[BASE_CURRENCY]?.available += amount;
        }
    }

    setBaseBalances() {
        this.balances.set("1", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });

        this.balances.set("2", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });

        this.balances.set("5", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });
    }
}