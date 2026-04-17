import { createClient } from "redis";
import { Engine } from "./trade/Engine.js";

//here infinitely loop is runnig, and we're pulling messages from redis queue

async function main() {
    const engine = new Engine();

    const redisClient = createClient();
    await redisClient.connect();
    console.log("Connected to redis");

    while(true) {
        const response = await redisClient.rPop("messaage" as string);

        if(!response) {
            console.log("didn't get response");
        } else {
            engine.process(JSON.parse(response)); //send the req to engine
        }
    }
}

main();