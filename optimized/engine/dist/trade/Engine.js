import { RedisManager } from "../ReadisManager.js";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, ON_RAMP } from "../types/fromApi.js";
import { Orderbook } from "./OrderBook.js";
import fs from "fs";
export const BASE_CURRENCY = "INR";
export class Engine {
    orderBooks = [];
    balances = new Map(); //a new map, to store all balances
    constructor() {
        let snapshot = null;
        try {
            if (process.env.WITH_SNAPSHOT) {
                snapshot = fs.readFileSync("./snapshot.json"); //read the file
            }
        }
        catch (error) {
            console.log("No snapshot found", error);
        }
        if (snapshot) { //CRASH RECOVERY
            const snapShotSNAP = JSON.parse(snapshot.toString());
            this.orderBooks = snapShotSNAP.orderbooks.map((snapOB) => (new Orderbook(snapOB.baseAsset, snapOB.bids, snapOB.asks, snapOB.lastTradeId, snapOB.currentPrice)));
            this.balances = new Map(snapShotSNAP.balances);
        }
        else { //FRESH START
            //create a fake orderBook
            this.orderBooks = [new Orderbook(`TATA`, [], [], 0, 0)];
            this.setBaseBalances();
        }
        setInterval(() => {
            this.saveSnapShot();
        }, 10000 * 3);
    }
    saveSnapShot() {
        const snapshotSnapshot = {
            orderbooks: this.orderBooks.map(o => o.getSnapshot()),
            balances: Array.from(this.balances.entries()), // Map → Array (to save in JSON)
        };
        fs.writeFile("./snapshot.json", JSON.stringify(snapshotSnapshot), () => {
            console.log("Snapshot is being saved");
        });
    }
    process({ clientId, message }) {
        switch (message.type) {
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
                    });
                }
                catch (error) { //for any reason(insufficient fund), order is cancelled
                    console.log(error);
                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId: "",
                            executedQty: 0,
                            remainingQty: 0
                        }
                    });
                }
                break;
            case CANCEL_ORDER:
                try {
                    const orderId = message.data.orderId;
                    const cancelMarket = message.data.market; //market name
                    const cancelOrderbook = this.orderBooks.find(o => o.ticker() === cancelMarket); //OB
                    if (!cancelOrderbook) {
                        throw new Error("No Orderbook found");
                    }
                    const quoteAsset = cancelMarket.split("_")[1]; //what you pay with("USD")
                    const order = cancelOrderbook.asks.find(o => o.orderId === orderId) ||
                        cancelOrderbook.bids.find(o => o.orderId === orderId);
                    if (!order) {
                        console.log("No order found");
                        throw new Error("No order found");
                    }
                    if (order.side === "buy") {
                        const price = cancelOrderbook.cancelBid(order);
                        const leftQuantity = (order.quantity - order.filled) - order.price;
                        //@ts-ignore
                        this.balances.get(order.userId)[BASE_CURRENCY].available += leftQuantity;
                        //@ts-ignore
                        this.balances.get(order.userId)[BASE_CURRENCY].locked -= leftQuantity;
                        if (price) {
                            this.sendUpdatedDepthAt(price.toString(), cancelMarket);
                        }
                    }
                    else { //"sell"
                        const price = cancelOrderbook.cancelAsk(order);
                        const leftQuantity = order.quantity - order.filled;
                        //@ts-ignore
                        this.balances.get(order.userId)[quoteAsset].available += leftQuantity;
                        //@ts-ignore
                        this.balances.get(order.userId)[quoteAsset].locked -= leftQuantity;
                        if (price) {
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
                    });
                }
                catch (error) {
                    console.log("Error while canceling order");
                    console.log(error);
                }
                break;
            case GET_OPEN_ORDERS:
                try {
                    const openOrderBook = this.orderBooks.find(o => o.ticker() === message.data.market);
                    if (!openOrderBook) {
                        throw new Error("No orderbook found");
                    }
                    const openOrders = openOrderBook.getOpenOrders(message.data.userId);
                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "OPEN_ORDERS",
                        payload: openOrders,
                    });
                }
                catch (error) {
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
                    if (!orderBook) {
                        throw new Error("No order book found");
                    }
                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: orderBook.getDepth(),
                    });
                }
                catch (error) {
                    console.log(error);
                    RedisManager.getInstanse().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: {
                            bids: [],
                            asks: [],
                        }
                    });
                }
                break;
        }
    }
    //create the order, update it, and push to the ws 
    createOrder(market, price, quantity, side, userId) {
        const orderbook = this.orderBooks.find(o => o.ticker() === market);
        if (!orderbook) {
            throw new Error("No orderbook found");
        }
        const baseAsset = market.split("_")[0]; //what you're trading(BTC)
        const quoteAsset = market.split("_")[1]; //what you pay with(USD)
        //lock the fund, so user cannot spend it again
        this.checkAndLockFunds(baseAsset, quoteAsset, side, userId, price, quantity);
        const order = {
            price: Number(price),
            quantity: Number(quantity),
            orderId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            filled: 0,
            side,
            userId,
        };
        const { executedQty, fills } = orderbook.addOrder(order); //match and add in orderBook
        //update the balance, move the money and quantity
        this.updateBalance(userId, baseAsset, quoteAsset, side, fills, executedQty);
        this.createDbTrades(fills, market, userId); //Save filled in db
        this.updateDbOrders(order, executedQty, fills, market); //Update filled orders
        this.publishWsDepthUpdates(fills, price, side, market); //Update depth table(WebSocket)
        this.publishWsTrades(fills, userId, market); //WebSocket (trade notification)
        return { executedQty, fills, orderId: order.orderId };
    }
    updateDbOrders(order, executedQty, fills, market) {
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
        });
        fills.forEach(fill => {
            RedisManager.getInstanse().pushMessage({
                type: "ORDER_UPDATE",
                data: {
                    orderId: fill.markerOrderId,
                    executedQty: fill.quantity,
                }
            });
        });
    }
    createDbTrades(fills, market, userId) {
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
            });
        });
    }
    publishWsTrades(fills, userId, market) {
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
            });
        });
    }
    sendUpdatedDepthAt(price, market) {
        const orderbook = this.orderBooks.find(ob => ob.ticker() === market);
        if (!orderbook) {
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
        });
    }
    publishWsDepthUpdates(fills, price, side, market) {
        const orderBook = this.orderBooks.find(o => o.ticker() === market);
        if (!orderBook)
            return;
        const depth = orderBook.getDepth();
        if (side === "buy") {
            const updateAsks = depth.asks.filter((x) => {
                fills.map(f => f.price).includes(x[0].toString());
            });
            const updateBids = depth.bids.find(x => x[0] === price);
            console.log("publish ws depth updates");
            RedisManager.getInstanse().publishMessage(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updateAsks,
                    b: updateBids ? [updateBids] : [],
                    e: "depth"
                }
            });
        }
        if (side === "sell") {
            const updateBids = depth.bids.filter((x) => {
                fills.map(f => f.price).includes(x[0].toString());
            });
            const updateAsk = depth.asks.find(x => x[0] === price);
            console.log("publish ws depth updates");
            RedisManager.getInstanse().publishMessage(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updateAsk ? [updateAsk] : [],
                    b: updateBids,
                    e: "depth"
                }
            });
        }
    }
    updateBalance(userId, baseAseet, quoteAsset, side, fills, executedQty) {
        if (side === "buy") {
            fills.forEach(fill => {
                const sellerBalance = this.getAssetBalance(fill.otherUserId, quoteAsset);
                const buyerQuoteBalance = this.getAssetBalance(userId, quoteAsset); //(USD)
                const sellerBaseBalance = this.getAssetBalance(fill.otherUserId, baseAseet); //(BTC)
                const buyerBaseBalance = this.getAssetBalance(userId, baseAseet);
                const quoteAmount = fill.quantity * Number(fill.price);
                //Seller(fill.otherUserId) will get USD
                sellerBalance.available += quoteAmount;
                //Buyer locked balance will decrease
                buyerQuoteBalance.locked -= quoteAmount;
                // Seller ke locked BTC shares transfer ho gaye
                sellerBaseBalance.locked -= fill.quantity;
                //Buyer receive's stoke
                buyerBaseBalance.available += fill.quantity;
            });
        }
        else { //"sell"
            fills.forEach(fill => {
                const buyerQuoteBalance = this.getAssetBalance(fill.otherUserId, quoteAsset);
                const sellerQuoteBalance = this.getAssetBalance(userId, quoteAsset);
                const buyerBaseBalance = this.getAssetBalance(fill.otherUserId, baseAseet);
                const sellerBaseBalance = this.getAssetBalance(userId, baseAseet);
                const quoteAmount = fill.quantity * Number(fill.price);
                //Buyer(fill.otherUserId) locked balanse will be decereased
                buyerQuoteBalance.locked -= quoteAmount;
                //Seller balanse will increase
                sellerQuoteBalance.available += quoteAmount;
                //stoke added in Buyer's balance
                buyerBaseBalance.available += fill.quantity;
                //stock redused from seller
                sellerBaseBalance.locked -= fill.quantity;
            });
        }
    }
    checkAndLockFunds(baseAsset, quoteAsset, side, userId, price, quantity) {
        if (side === "buy") {
            if ((this.balances.get(userId)?.[quoteAsset]?.available || 0) < Number(quantity) * Number(price)) {
                throw new Error("Insufficient fund");
            }
            // shift USD from available to locked
            const quoteBalance = this.getAssetBalance(userId, quoteAsset);
            quoteBalance.available -= (Number(quantity) * Number(price));
            quoteBalance.locked += (Number(quantity) * Number(price));
        }
        else { //"sell"
            if ((this.balances.get(userId)?.[baseAsset]?.available || 0) < Number(quantity)) {
                throw new Error("Insufficient stocks");
            }
            //shift stock quantity from available to locked
            const baseBalance = this.getAssetBalance(userId, baseAsset);
            baseBalance.available -= Number(quantity);
            baseBalance.locked += Number(quantity);
        }
    }
    onRamp(userId, amount) {
        const userBalance = this.balances.get(userId);
        if (!userBalance) {
            this.balances.set(userId, {
                [BASE_CURRENCY]: {
                    available: amount,
                    locked: 0,
                }
            });
        }
        else {
            userBalance[BASE_CURRENCY] = userBalance[BASE_CURRENCY] || {
                available: 0,
                locked: 0,
            };
            userBalance[BASE_CURRENCY].available += amount;
        }
    }
    //helper funtion to get balances
    getAssetBalance(userId, asset) {
        const userBalance = this.balances.get(userId);
        if (!userBalance) {
            throw new Error(`No balance found for user ${userId}`);
        }
        const assetBalance = userBalance[asset];
        if (!assetBalance) {
            throw new Error(`No ${asset} balance found for user ${userId}`);
        }
        return assetBalance;
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
//# sourceMappingURL=Engine.js.map