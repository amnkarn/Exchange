import express, { Router } from "express";
import { RedisManager } from "../RedisManager.js";
const depthRouter = express.Router();
depthRouter.get("/", async (req, res) => {
    const { symbol } = req.query;
    const responce = await RedisManager.getInstance().sendAndAwait({
        //send the type and market name to RedisManager and wait in queue till get the res from engine
        type: "GET_DEPTH",
        data: {
            market: symbol
        }
    });
    res.json(responce.payload);
});
export default depthRouter;
//# sourceMappingURL=depth.route.js.map