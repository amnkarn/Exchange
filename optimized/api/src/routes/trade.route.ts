import express, { Router } from "express";

const tradeRouter: Router = express.Router();

tradeRouter.get("/", async (req, res) => {
    const { market } = req.body;

    //get from DB
    res.json({})
})


export default tradeRouter;