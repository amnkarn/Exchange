import express, { Router } from "express"

const tickerRouter: Router = express.Router();

tickerRouter.get("/", async (req, res) => {
    res.json({})
})


export default tickerRouter;