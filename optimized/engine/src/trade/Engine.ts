import { RedisManager } from "../ReadisManager.js";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, ON_RAMP, type MessageFromApi } from "../types/fromApi.js";
import { Orderbook } from "./OrderBook.js";
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
    private balances: Map<string, UserBalance> = new Map();


    constructor() {
        let snapshot = null;

        try {
            if (process.env.WITH_SNAPSHOT!) {
                snapshot = fs.readFileSync("./snapshot.json"); //read the file
            }
        } catch (error) {
            console.log("No snapshot found", error);
        }

        if (snapshot) {
            const snapShotSNAP = JSON.parse(snapshot.toString());

            this.orderBooks = snapShotSNAP.orderbooks.map((snapOB: any) => (
                new Orderbook(snapOB.baseAseet, snapOB.bids, snapOB.asks, snapOB.lastTradeId, snapOB.currentPrice
            )))

            this.balances = new Map(snapShotSNAP.balances);

        } else { //create a fresh fake orderBook
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
            balances: Array.from(this.balances.entries()), //convert in array
        }

        fs.writeFile("./snapshot.json", JSON.stringify(snapshotSnapshot), () => {
            console.log("Snapshot is being saved")
        });
    }
    

    process({ message, clientId }: {message: MessageFromApi, clientId: string}) {
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
                } catch (error) {
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

            case GET_DEPTH
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

    createOrder() {

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