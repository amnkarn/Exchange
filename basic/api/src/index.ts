import express from "express";
import { OrderInputSchema } from "./types.js";
import { orderbook, bookWithQuantity } from "./orderbook.js";

const app = express();
app.use(express.json());

const BASE_ASSET = 'BTC'; //what you're trading
const QUOTE_ASSET = 'USD'; //what you pay with
let GLOBAL_TRADE_ID = 0;


app.post("/api/v1/order", async (req, res) => {
    const parsedData = OrderInputSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).send(parsedData.error.message);
    }

    const { baseAsset, quoteAsset, price, quantity, side, type, kind } = parsedData.data;
    const orderId = getOrderId();

    if (baseAsset !== BASE_ASSET || quoteAsset !== QUOTE_ASSET) {
        return res.status(400).json({
            message: "Invalid base or quote asset"
        })
    }

    const { executedQty, fills } = fillOrder({ orderId, price, quantity, side, type, kind });

    res.send({
        orderId,
        executedQty,
        fills
    })
})


function getOrderId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}


app.listen(3000, () => {
    console.log("app is listning on port 3000");
})

interface Fill {
    price: number,
    quantity: number,
    tradeId: number,
}

interface FillOrderParams {
    orderId: string,
    price: number,
    quantity: number,
    side: 'buy' | 'sell',
    type: 'limit' | 'market';
    kind?: 'ioc' | undefined;
}

interface FillOrderResponse {
    status: "rejected" | "accepted",
    executedQty: number,
    fills: Fill[]
}

// main function, that tries to match order against existing orders on the book.
function fillOrder(params: FillOrderParams): FillOrderResponse {
    const { orderId, price, side, type, kind } = params;
    let { quantity } = params;
    const fills: Fill[] = []; //store every successful trade.
    
    const maxFilledQuantity = getFillAmount(price, quantity, side);
    let executedQty = 0; //how much has actually been traded

    if (kind == 'ioc' && maxFilledQuantity < quantity) { //if can't fill the order
        return {
            status: "rejected",
            executedQty: maxFilledQuantity,
            fills: []
        }
    }

    if (side === 'buy') {
        // short the asks
        orderbook.asks.forEach(orderB => {
            //if user price is satisfing orderBook price
            if (orderB.price <= price && quantity > 0) {
                const filledQuantity = Math.min(quantity, orderB.quantity); //this much qty can be filled
                orderB.quantity -= filledQuantity; //orderbook seller is done

                //summary me asks[orderB.price] ko 1 se ghata
                bookWithQuantity.asks[orderB.price] 
                    = (bookWithQuantity.asks[orderB.price] || 0) - filledQuantity;

                fills.push({
                    price: orderB.price,
                    quantity: filledQuantity,
                    tradeId: GLOBAL_TRADE_ID,
                })

                executedQty += filledQuantity;
                quantity -= filledQuantity; // still need or quantity filled

                if (orderB.quantity === 0) { //seller fully filled, remove from orderbook
                    orderbook.asks.splice(orderbook.asks.indexOf(orderB), 1);
                }

                if (bookWithQuantity.asks[orderB.price] === 0) { //delete from summenry if there is no ask
                    delete bookWithQuantity.asks[orderB.price];
                }
            }
        })

        // Place on the orderbook if all quantity not filled
        if (quantity !== 0) {
            orderbook.bids.push({
                price,
                quantity,
                side: 'bid',
                orderId,
            })

            bookWithQuantity.bids[price] = (bookWithQuantity.bids[price] || 0) + quantity; // add in summery
        }

    } else { //side === 'sell'
        orderbook.bids.forEach(orderB => {
            if (orderB.price >= price && quantity > 0) {
                const filledQuantity = Math.min(quantity, orderB.quantity);
                orderB.quantity -= filledQuantity;

                //reduce bids[price] from summery
                bookWithQuantity.bids[price] = (bookWithQuantity.bids[price] || 0) - filledQuantity;

                fills.push({ //add in record
                    price: orderB.price,
                    quantity: filledQuantity,
                    tradeId: GLOBAL_TRADE_ID
                })

                executedQty += filledQuantity;
                quantity -= filledQuantity;

                if (orderB.quantity === 0) { //remove from order summry
                    orderbook.bids.splice(orderbook.bids.indexOf(orderB), 1);
                }

                if (bookWithQuantity.bids[orderB.price] === 0) { //delete that bid, whose summry is 0
                    delete bookWithQuantity.bids[orderB.price]
                }
            }
        })

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

    return { // return after success
        status: 'accepted',
        executedQty,
        fills
    }
}

// check how much quantity can be filled
function getFillAmount(price: number, quantity: number, side: 'buy' | 'sell'): number {
    let filled = 0;

    if (side == 'buy') {
        orderbook.asks.forEach(orderB => {
            if (orderB.price <= price) {
                filled += Math.min(quantity, orderB.quantity);
            }
        })

    } else { //sell
        orderbook.bids.forEach(orderB => {
            if (orderB.price >= price) {
                filled += Math.min(quantity, orderB.quantity);
            }
        })
    }

    return filled;
}