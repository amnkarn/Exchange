import { createClient, type RedisClientType } from "redis";
import { UserManager } from "./UserManager.js";


export class SubscriptionManager {
    private static instance: SubscriptionManager;
    private subscriptions: Map<string, string[]> = new Map(); //user subscribed channels
    private reverseSubscriptions: Map<string, string[]> = new Map(); //channel subscribed users
    //this redisClient only used to subscribe and unsubscribe the channel, and then engine match and send the reply on this redisClient
    private redisClient: RedisClientType;

    constructor() { //automatically crea the redisClient
        this.redisClient = createClient();
        this.redisClient.connect(); //this is a Promise
    }

    public static getInstanse() {
        if(!this.instance) {
            this.instance = new SubscriptionManager();
        }
        return this.instance;
    }

    public subscribe(userId: string, subscription: string) { //(ax52er424, trade@TATA_INR)
        if(this.subscriptions.get(userId)?.includes(subscription)){ //already subscribed
            return;
        }

        const newAddedSubscriptions = (this.subscriptions.get(userId) || []).concat(subscription);
        const addedReversedSubs = (this.reverseSubscriptions.get(subscription) || []).concat(userId);
        //add the subscribtion channel in both map
        this.subscriptions.set(userId, newAddedSubscriptions);
        this.reverseSubscriptions.set(subscription, addedReversedSubs);
        
        //if this is first subscriber to the channel, then connect reddis with that channel
        if(this.reverseSubscriptions.get(subscription)?.length === 1) { //save repeatation
            //when we subscribe any channel, we get an callback handler, and we called "redisCallbackHandler" on this subscribe, and in that handler we send the message to every ws(client)
            this.redisClient.subscribe(subscription, this.redisCallbackHandler);
        }
    }

    //this method is called, when the first subscriber subscribes the channel
    //if reddis receives any message on that channel, then forward it to every subscribed users
    public redisCallbackHandler(message: string, channel: string) {
        const parsedMessage = JSON.parse(message);
        this.reverseSubscriptions.get(channel)?.forEach((s) => {
            UserManager.getInstanse().getUser(s)?.emit(parsedMessage);
        })
    }

    public unsubscribe(userId: string, subscription: string) {
        //remove from subscribe and reverseSubscribe
        const subscriptions = this.subscriptions.get(userId);
        if(subscriptions) {
            this.subscriptions.set(userId, subscriptions?.filter(s => s !== userId));
        }

        const reverseSubscriptions = this.reverseSubscriptions.get(subscription);
        if(reverseSubscriptions) {
            this.reverseSubscriptions.set(userId, reverseSubscriptions.filter(rs => rs !== userId));

            //if this is last subscribed user to that channel, then unsubscribe the redis client
            if(this.reverseSubscriptions.get(subscription)?.length === 0) {
                this.reverseSubscriptions.delete(subscription);
                this.redisClient.unsubscribe(subscription);
            }
        }
    }

    //it is triggered when "ws connection" is close through "UserManager"
    public userLeft(userId: string) {
        console.log("user left " + userId);
        this.subscriptions.get(userId)?.forEach(s => this.unsubscribe(userId, s));
    }

    //NO USE
    getSubscriptions(userId: string) { //find all subscriptions
        return this.subscriptions.get(userId) || [];
    }
}