import express, { Router } from "express";
import { OrderInputSchema } from "../types/orderBook.js";
import { orderbook, bookWithQuantity } from "../types/order.js";
const BASE_ASSET = 'BTC'; //what you're trading
const QUOTE_ASSET = 'USD'; //what you pay with
let GLOBAL_TRADE_ID = 0;
const orderRouter = express.Router();
orderRouter.get("/", async (req, res) => {
    const order = OrderInputSchema.safeParse(req.body);
    if (!order.success) {
        return res.status(400).send(order.error.message);
    }
    //price: at what price, quantity: how many btc, side: Buy or Sell, kind: Order type
    const { baseAsset, quoteAsset, price, quantity, side, type, kind } = order.data;
    const orderId = getOrderId();
    //currently trade in only BTC and currency is only USD
    if (baseAsset !== BASE_ASSET || quoteAsset !== QUOTE_ASSET) {
        return res.status(400).json({
            message: "Invalid base or quote asset"
        });
    }
    const { executedQty, fills } = fillOrder({ orderId, price, quantity, side, type, kind });
    res.send({
        orderId,
        executedQty,
        fills
    });
});
function getOrderId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
// main function, that tries to match order against existing orders on the book.
function fillOrder(params) {
    const { orderId, price, side, type, kind } = params; //user details
    let { quantity } = params; //user want's this much
    const fills = []; //used to store every successful trade.
    const maxFilledQuantity = getFillAmount(price, quantity, side);
    let executedQty = 0; //how much has actually been traded
    if (kind == 'ioc' && maxFilledQuantity < quantity) { // if can't fill the order
        return {
            status: "rejected",
            executedQty: maxFilledQuantity,
            fills: []
        };
    }
    if (side === 'buy') {
        // short the asks
        orderbook.asks.forEach(o => {
            //if user price is satisfing orderBook price
            if (o.price <= price && quantity > 0) {
                const filledQuantity = Math.min(quantity, o.quantity); //this much qty can be filled
                o.quantity -= filledQuantity; //seller is done
                //summary me asks[o.price] ko 1 se ghata
                bookWithQuantity.asks[o.price] = (bookWithQuantity.asks[o.price] || 0) - filledQuantity;
                fills.push({
                    price: o.price,
                    quantity: filledQuantity,
                    tradeId: GLOBAL_TRADE_ID,
                });
                executedQty += filledQuantity;
                quantity -= filledQuantity; // still need or quantity filled
                if (o.quantity === 0) { //seller fully filled, remove from orderbook
                    orderbook.asks.splice(orderbook.asks.indexOf(o), 1);
                }
                if (bookWithQuantity.asks[price] === 0) { //delete from summenry if there is no ask
                    delete bookWithQuantity.asks[price];
                }
            }
        });
        // Place on the book if order not filled, user neek more quantity
        if (quantity !== 0) {
            orderbook.bids.push({
                price,
                quantity,
                side: 'bid',
                orderId,
            });
            bookWithQuantity.bids[price] = (bookWithQuantity.bids[price] || 0) + quantity; // add in summery
        }
    }
    else { //side === 'sell'0
        orderbook.bids.forEach(o => {
            if (o.price >= price && quantity > 0) {
                const filledQuantity = Math.min(quantity, o.quantity);
                o.quantity -= filledQuantity;
                //reduce bids[price] from summery
                bookWithQuantity.bids[price] = (bookWithQuantity.bids[price] || 0) - filledQuantity;
                fills.push({
                    price: o.price,
                    quantity: filledQuantity,
                    tradeId: GLOBAL_TRADE_ID
                });
                executedQty += filledQuantity;
                quantity -= filledQuantity;
                if (o.quantity === 0) { //remove from order summry
                    orderbook.bids.splice(orderbook.bids.indexOf(o), 1);
                }
                if (bookWithQuantity.bids[price] === 0) { //delete that bid, whose summry is 0
                    delete bookWithQuantity.bids[price];
                }
            }
        });
        // place on book, if order not filled
        if (quantity !== 0) {
            orderbook.asks.push({
                price,
                quantity: quantity,
                side: 'ask',
                orderId
            });
            bookWithQuantity.asks[price] = (bookWithQuantity.asks[price] || 0) + (quantity);
        }
    }
    console.log("Order Book");
    console.log(orderbook);
    console.log("Books with quantity");
    console.log(bookWithQuantity);
    return {
        status: 'accepted',
        executedQty,
        fills
    };
}
function getFillAmount(price, quantity, side) {
    let filled = 0;
    if (side == 'buy') { // check how much quantity can be filled
        orderbook.asks.forEach(o => {
            if (o.price <= price) {
                filled += Math.min(quantity, o.quantity);
            }
        });
    }
    else { // side = sell
        orderbook.bids.forEach(o => {
            if (o.price >= price) {
                filled += Math.min(quantity, o.quantity);
            }
        });
    }
    return filled;
}
export default orderRouter;
//# sourceMappingURL=order.route.js.map