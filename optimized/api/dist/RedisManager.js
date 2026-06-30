import { createClient } from "redis";
import {} from "./types/index.js";
import {} from "./types/to.js";
const url = "redis://localhost:6379";
//RedisManager is a way to talk to engine(matching and other logic), and crate a queue for the sequence wise process(fifo)
export class RedisManager {
    client;
    publisher;
    static instance;
    constructor() {
        this.client = this.client = createClient({ url }); //Dedicated Listener
        this.publisher = createClient({ url }); //Dedicated Sender
        //create client & publisher connection
        this.client.connect();
        this.publisher.connect();
    }
    //Singleton patern
    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }
    sendAndAwait(message) {
        return new Promise((resolve) => {
            const id = this.getRandomClientId();
            //BROWSER send req to API, API push message and id in queue(with the name of message), and ENGINE take req using rPop and publish the response on the clientId.
            this.client.subscribe(id, (message) => {
                this.client.unsubscribe(id); //unsubscribe this id after any reply
                resolve(JSON.parse(message));
            });
            //push in list "message"(Redis Queue)
            this.publisher.lPush("message", //queue name
            JSON.stringify({ clientId: id, message }));
        });
    }
    getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
//# sourceMappingURL=RedisManager.js.map