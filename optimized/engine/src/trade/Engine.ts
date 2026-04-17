import { Orderbook } from "./OrderBook.js";
import fs from "fs"

export const BASE_CURRENCY = "INR";

interface UserBalance {
    [key: string]: {
        available: number,
        locked: number,
    }
}

export class Engine {
    private orderBooks: Orderbook[] = [];
    private balances: Map<string, UserBalance> = new Map();


    constructor() {
        let snapshot = null;

        try {
            if (process.env.WITH_SNAPSHOT!) {
                snapshot = fs.readFileSync("./snapshot.json"); //read the file
            }
        } catch (error) {
            console.log("No snapshot found", error);
        }

        if (snapshot) {
            const snapShotSNAP = JSON.parse(snapshot.toString());

            this.orderBooks = snapShotSNAP.orderbooks.map((o: any) => (
                new Orderbook(o.baseAseet, o.bids, o.asks, o.lastTradeId, o.currentPrice
            )))

            this.balances = new Map(snapShotSNAP.balances);

        } else { //create a fresh fake orderBook
            this.orderBooks = [new Orderbook(`TATA`, [], [], 0, 0)];
            this.setBaseBalances();
        }

        setInterval(() => {
            this.saveSnapShot();
        }, 1000 * 3)
    }

    saveSnapShot() {
        const snapshotSnapshot = {
            orderbooks: this.orderBooks.map(o => o.getSnapshot()),
            balances: Array.from(this.balances.entries()), //convert in array
        }

        fs.writeFile("./snapshot.json", JSON.stringify(snapshotSnapshot), () => {
            console.log("Snapshot is being saved")
        });
    }

    

    process({ response }: any) {

    }


    setBaseBalances() {
        this.balances.set("1", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });

        this.balances.set("2", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });

        this.balances.set("5", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });
    }

}