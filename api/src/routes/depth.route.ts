import express, { Router } from "express"
import { RedisManager } from "../RedisManager.js";

const depthRouter: Router = express.Router();

depthRouter.get("/", async (req, res) => {
    const { symbol } = req.query;
    const responce = await RedisManager.getInstance().sendAndAwait({
        type: "GET_DEPTH",
        data: {
            market: symbol as string
        }
    })

    res.json(responce.payload);
})


export default depthRouter;