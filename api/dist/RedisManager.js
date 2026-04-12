import { createClient } from "redis";
import {} from "./types/index.js";
import {} from "./types/to.js";
export class RedisManager {
    client;
    publisher;
    static instance;
    constructor() {
        this.client = createClient();
        this.client.connect();
        this.publisher = createClient();
        this.publisher.connect();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }
    sendAndAwait(message) {
        return new Promise((resolve) => {
            const id = this.getRandomClientId();
            this.client.subscribe(id, (message) => {
                this.client.unsubscribe(id);
                resolve(JSON.parse(message));
            });
            this.publisher.lPush("message", JSON.stringify({ clientId: id, message }));
        });
    }
    getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
//# sourceMappingURL=RedisManager.js.map