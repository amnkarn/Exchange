import { createClient } from "redis";
import { Engine } from "./trade/Engine.js";
//here infinitely loop is runnig, and we're pulling messages from redis queue
async function main() {
    const engine = new Engine();
    const redisClient = createClient();
    await redisClient.connect();
    console.log("Connected to redis");
    while (true) {
        //infinitely pull message from redis queue
        const response = await redisClient.rPop("message");
        if (!response) {
        }
        else {
            engine.process(JSON.parse(response)); //send the req to engine
            // { clientId: "x7f2k9m", message: { type: "CREATE_ORDER", ... } }
        }
    }
}
main();
//# sourceMappingURL=index.js.map