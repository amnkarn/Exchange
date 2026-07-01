import { createClient } from "redis";
//We'll receive api req in index.ts from redis queue, and process it in engine and then send it to the api using received client id
//Browser subscribe the ws and send the SUBSCRIBE AND UNSUBSCRIBE message through redisClient to the engine, then using publishMessage we'll send the engine's response to ws then ws send to client
export class RedisManager {
    client;
    static instanse;
    constructor() {
        this.client = createClient();
        this.client.connect();
    }
    static getInstanse() {
        if (!this.instanse) {
            this.instanse = new RedisManager();
        }
        return this.instanse;
    }
    //push enige's reply to db queue(to "db_processor" channel)
    pushMessage(message) {
        this.client.lPush("db_processor", JSON.stringify(message));
    }
    //send engine's reply to ws(subscribed to the channel)
    publishMessage(channel, message) {
        this.client.publish(channel, JSON.stringify(message));
    }
    //send engine's reply to redis "clientId" channel
    sendToApi(clientId, message) {
        this.client.publish(clientId, JSON.stringify(message));
    }
}
//# sourceMappingURL=ReadisManager.js.map