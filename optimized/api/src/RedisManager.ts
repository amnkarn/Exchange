import { type RedisClientType, createClient } from "redis";
import { type MessageFromOrderbook } from "./types/index.js";
import { type MessageToEngine } from "./types/to.js";
const url = "redis://localhost:6379";

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

    //save from re-connection, "Singleton paattern"
    public static getInstance() {
        if(!this.instance) {
            this.instance = new RedisManager();
        }

        return this.instance;
    }

    public sendAndAwait(message: MessageToEngine) { //pub-sub operation
        return new Promise<MessageFromOrderbook>((resolve) => {
            const id = this.getRandomClientId();

            //engine pulish result on this id
            //this will catch that msg
            this.client.SUBSCRIBE(id, (message) => { //subscribe the pub-sub
                this.client.UNSUBSCRIBE(id); //unsubscribe this id after any reply
                resolve(JSON.parse(message));
            })

            //push in list "message"(Redis Queue)
            this.publisher.lPush("message", JSON.stringify({clientId: id, message}));
        })
    }

    public getRandomClientId() { //create random string '29urmxrmf1vd6mxa6k3ue6'
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}