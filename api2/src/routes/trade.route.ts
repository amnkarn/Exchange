import express from "express";

const tradeRouter = express.Router();

tradeRouter.get("/", async (req, res) => {
    const { market } = req.body;

    //get from DB
    res.json({})
})


export default tradeRouter;