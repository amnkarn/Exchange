import express from "express";
import { OrderInputSchema } from "./types.js";
import { orderbook, bookWithQuantity } from "./orderbook.js";

const app = express();
app.use(express.json());

const BASE_ASSET = 'BTC' ; //what you're trading
const QUOTE_ASSET = 'USD'; //what you pay with
let GLOBAL_TRADE_ID = 0;


app.post("/api/v1/order", async (req, res) => {
    const order = OrderInputSchema.safeParse(req.body);

    if(!order.success) {
        return res.status(400).send(order.error.message);
    }

    //price: at what price, quantity: how many btc, side: Buy or Sell, kind: Order type
    const { baseAsset, quoteAsset, prise, quantity, side, type, kind } = order.data;
    const orderId = getOrderId();

    if(baseAsset !== BASE_ASSET || quoteAsset !== QUOTE_ASSET) {
        return res.status(400).json({
            message: "Invalid base or quote asset"
        })
    }

    const { executedQty, fills } = fillOrder(orderId, prise, quantity, side, kind);

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
    type?: 'ioc'
}

interface FillOrderResponse {
    status: "rejected" | "accepted",
    executedQty: number,
    fills: Fill[]
}

// main function, that tries to match order against existing orders on the book.
function fillOrder(params: FillOrderParams): FillOrderResponse {
    const { orderId, price, quantity, side, type } = params;

    const fills: Fill[] = [];
    const maxFilledQuantity = getFillAmount(price, quantity, side);
    let executedQty = 0;

    if (type == 'ioc' && maxFilledQuantity < quantity) {
        return {
            status: "rejected",
            executedQty: maxFilledQuantity,
            fills: []
        }
    }

    if(side === 'buy') {


    } else { //side === 'sell'

    }
    
    return { // return after success
        status: 'accepted',
        executedQty,
        fills
    }
}

function getFillAmount(price: number, quantity: number, side: 'buy' | 'sell'): number {
    let filled = 0;

    if(side == 'buy') { // check how much quantity can be filled
        orderbook.asks.forEach( o => {
            if(o.price <= price) {
                filled += Math.min(quantity, o.quantity);
            }
        })

    } else { // side = sell
        orderbook.bids.forEach(o => {
            if(o.price >= price) {
                filled += Math.min(quantity, o.quantity);
            }
        })
    }

    return filled;
}