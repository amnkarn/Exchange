import express from "express";
import orderRouter from "./routes/order.route";
import cors from "cors"
import depthRouter from "./routes/depth.route";
import tradeRouter from "./routes/trade.route";
import klineRouter from "./routes/kline.route";
import tickerRouter from "./routes/ticker.routes"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/v1/order", orderRouter);
app.get("/api/v1/depth", depthRouter);
app.get("/api/v1/trades", tradeRouter);
app.get("/api/v1/klines", klineRouter);
app.get("/api/v1/tickers", tickerRouter);


app.listen(PORT, () => {
    console.log(`app is listning on port ${PORT}`);
})