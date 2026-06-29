import { type RedisClientType, createClient } from "redis";
import { type MessageFromOrderbook } from "./types/index.js";
import { type MessageToEngine } from "./types/to.js";
const url = "redis://localhost:6379";

//RedisManager is a way to talk to engine(matching and other logic), and crate a queue for the sequence wise process(fifo)

export class RedisManager {
    private client: RedisClientType;
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = this.client = createClient({ url }); //Dedicated Listener
        this.publisher = createClient({ url }); //Dedicated Sender

        //create client & publisher connection
        this.client.connect();
        this.publisher.connect();
    }

    //Singleton patern
    public static getInstance() {
        if(!this.instance) {
            this.instance = new RedisManager();
        }

        return this.instance;
    }

    public sendAndAwait(message: MessageToEngine) { //pub-sub operation
        return new Promise<MessageFromOrderbook>((resolve) => {
            const id = this.getRandomClientId();

            //engine will publish result on this id, and we will catch that msg
            this.client.subscribe(id, (message) => { //subscribe the pub-sub
                this.client.unsubscribe(id); //unsubscribe this id after any reply
                resolve(JSON.parse(message));
            })

            //push in list "message"(Redis Queue)
            this.publisher.lPush("message", JSON.stringify({
                clientId: id, 
                message
            }));
        })
    }

    public getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}