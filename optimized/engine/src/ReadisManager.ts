import { createClient, type RedisClientType } from "redis"
import type { ORDER_UPDATE, TRADE_ADDED } from "./types/index.js"
import type { WsMessage } from "./types/toWs.js"
import type { MessageToApi } from "./types/toApi.js"


type DB_MESSAGE = {
    type: typeof TRADE_ADDED
    data: {
        id: string,
        isBuyerMaker: boolean,
        price: string,
        quantity: string,
        quoteQuantity: string,
        timestamp: number,
        market: string
    }
} | {
    type: typeof ORDER_UPDATE
    data: {
        orderId: string,
        executedQty: number,
        market?: string,
        price?: string,
        quantity?: string,
        side?: 'buy' | 'sell'
    }
}

export class RedisManager {
    private client: RedisClientType;
    private static instanse: RedisManager;

    constructor() {
        this.client = createClient();
        this.client.connect();
    }

    public static getInstanse() {
        if(!this.instanse) {
            this.instanse = new RedisManager();
        }

        return this.instanse;
    }

    public pushMessage(message: DB_MESSAGE) {
        this.client.lPush("db_processor", JSON.stringify(message));
    }

    //send engine's reply to ws(subscribed to the channel)
    public publishMessage(channel: string, message: WsMessage) {
        this.client.publish(channel, JSON.stringify(message));
    }

    //send engine's reply to redis "clientId" channel
    public sendToApi(clientId: string, message: MessageToApi) {
        this.client.publish(clientId, JSON.stringify(message));
    }
}