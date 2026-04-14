import express from "express";
import cors from "cors";
import orderRouter from "./routes/order.route.js";
import depthRouter from "./routes/depth.route.js";
import tradeRouter from "./routes/trade.route.js";
import klineRouter from "./routes/kline.route.js";
import tickerRouter from "./routes/ticker.routes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/order", orderRouter);
app.use("/api/v1/depth", depthRouter);
app.use("/api/v1/trades", tradeRouter);
app.use("/api/v1/klines", klineRouter);
app.use("/api/v1/tickers", tickerRouter);


app.listen(PORT, () => {
    console.log(`app is listning on port ${PORT}`);
})