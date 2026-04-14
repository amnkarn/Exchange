import express, { Router, type Request, type Response } from "express";
import { RedisManager } from "../RedisManager.js";
import { CREATE_ORDER, GET_OPEN_ORDERS, type MessageFromOrderbook } from "../types/index.js";

const orderRouter: Router = express.Router();

orderRouter.post("/", async (req: Request, res: Response) => {
    const { market, price, quantity, side, userId } = req.body;
    //console.log({ market, price, quantity, side, userId });
    
    const response: MessageFromOrderbook = await RedisManager.getInstance().sendAndAwait({
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
})

orderRouter.delete("/", async (req: Request, res: Response) => {
    const { orderId, market } = req.body;
    const response: MessageFromOrderbook = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_ORDER,
        data: {
            //@ts-ignore;
            orderId,
            market
        }
    });
    res.json(response.payload);
})

orderRouter.get("/open", async (req, res) => {
    const response: MessageFromOrderbook = await RedisManager.getInstance().sendAndAwait({
        type: GET_OPEN_ORDERS,
        data: {
            userId: req.query.userId as string,
            market: req.query.market as string
        }
    });
    res.json(response.payload);
});

export default orderRouter;