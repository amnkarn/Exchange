import express from "express"

const tickerRouter = express.Router();

tickerRouter.get("/", async (req, res) => {
    res.json({})
})


export default tickerRouter;