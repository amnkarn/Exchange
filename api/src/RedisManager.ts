import { type RedisClientType, createClient } from "redis";
import { type MessageFromOrderbook } from "./types/index.js";
import { type MessageToEngine } from "./types/to.js";

export class RedisManager {
    private client: RedisClientType;
    private publisher: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient(); //Dedicated Listener
        this.publisher = createClient(); //Dedicated Sender

        //create client & publisher connection
        this.client.connect();
        this.publisher.connect();
    }

    //save from re-connection, if not instanse then create this class
    public static getInstance() {
        if(!this.instance) {
            this.instance = new RedisManager();
        }

        return this.instance;
    }

    public sendAndAwait(message: MessageToEngine) { //pub-sub operation
        return new Promise<MessageFromOrderbook>((resolve) => {
            const id = this.getRandomClientId();

            //engine pulish result in this id
            //this will catch that msg
            this.client.SUBSCRIBE(id, (message) => { //subscribe the pub-sub
                this.client.UNSUBSCRIBE(id);
                resolve(JSON.parse(message));
            })

            //push in list "message"
            this.publisher.lPush("message", JSON.stringify({clientId: id, message}));
        })
    }

    public getRandomClientId() { //create some random string '29urmxrmf1vd6mxa6k3ue6'
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}