import express, { Router } from "express";
import { Client } from "pg";
const pgClient = new Client({
    user: 'your_user',
    host: 'database',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
});
pgClient.connect();
const klineRouter = express.Router();
klineRouter.get("/", async (req, res) => {
    const { market, interval, startTime, endTime } = req.query;
    let query;
    switch (interval) {
        case '1m':
            query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1h':
            query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
            break;
        case '1w':
            query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
            break;
        default:
            return res.status(400).send('Invalid interval');
    }
    try {
        //@ts-ignore
        const result = await pgClient.query(query, [new Date(startTime * 1000), new Date(endTime * 1000)]);
        res.json(result.rows.map(x => ({
            close: x.close,
            end: x.bucket,
            high: x.high,
            low: x.low,
            open: x.open,
            quoteVolume: x.quoteVolume,
            start: x.start,
            trades: x.trades,
            volume: x.volume,
        })));
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});
export default klineRouter;
//# sourceMappingURL=kline.route.js.map