import express, { Router } from "express";
import { RedisManager } from "../RedisManager.js";
import { CREATE_ORDER, GET_OPEN_ORDERS } from "../types/index.js";
const orderRouter = express.Router();
orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    //console.log({ market, price, quantity, side, userId });
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_ORDER,
        data: {
            market,
            price,
            quantity,
            side,
            userId
        }
    });
    //console.log(response);
    res.json(response.payload);
});
orderRouter.delete("/", async (req, res) => {
    const { orderId, market } = req.body;
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_ORDER,
        data: {
            //@ts-ignore;
            orderId,
            market
        }
    });
    res.json(response.payload);
});
orderRouter.get("/open", async (req, res) => {
    const response = await RedisManager.getInstance().sendAndAwait({
        type: GET_OPEN_ORDERS,
        data: {
            userId: req.query.userId,
            market: req.query.market
        }
    });
    res.json(response.payload);
});
export default orderRouter;
//# sourceMappingURL=order.route.js.map