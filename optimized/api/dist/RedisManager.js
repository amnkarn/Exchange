import { createClient } from "redis";
import {} from "./types/index.js";
import {} from "./types/to.js";
const url = "redis://localhost:6379";
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
    //save from re-connection, "Singleton paattern"
    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }
    sendAndAwait(message) {
        return new Promise((resolve) => {
            const id = this.getRandomClientId();
            console.log(id);
            //engine pulish result on this id
            //this will catch that msg
            this.client.SUBSCRIBE(id, (message) => {
                this.client.UNSUBSCRIBE(id); //unsubscribe this id after any reply
                resolve(JSON.parse(message));
            });
            //push in list "message"(Redis Queue)
            this.publisher.lPush("message", JSON.stringify({ clientId: id, message }));
        });
    }
    getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
//# sourceMappingURL=RedisManager.js.map