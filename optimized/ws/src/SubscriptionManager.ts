import { createClient, RedisClient, type RedisClientType } from "redis";
import { UserManager } from "./UserManager.js";


export class SubscriptionManager {
    private static instance: SubscriptionManager;
    private subscriptions: Map<string, string[]> = new Map(); //user subscribed channels
    private reverseSubscriptions: Map<string, string[]> = new Map(); //channel subscribed users
    private redisClient: RedisClientType;

    constructor() {
        this.redisClient = createClient();
        this.redisClient.connect(); //this is a Promise
    }

    public static getInstanse() {
        if(!this.instance) {
            this.instance = new SubscriptionManager();
        }
        return this.instance;
    }

    public subscribe(userId: string, subscription: string) {
        if(this.subscriptions.get(userId)?.includes(subscription)){ //already subscribed
            return;
        }

        const newAddedSubscriptions = (this.subscriptions.get(userId) || []).concat(subscription);
        const addedReversedSubs = (this.reverseSubscriptions.get(subscription) || []).concat(userId);

        this.subscriptions.set(userId, newAddedSubscriptions);
        this.reverseSubscriptions.set(userId, addedReversedSubs);
        
        //if this is first subscriber to the channel, then connect reddis with that channel
        if(this.reverseSubscriptions.get(subscription)?.length === 1) { //save repeatation
            this.redisClient.subscribe(subscription, this.redisCallbackHandler);
        }
    }

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

    public userLeft(userId: string) {
        console.log("user left " + userId);
        this.subscriptions.get(userId)?.forEach(s => this.unsubscribe(userId, s));
    }

    getSubscriptions(userId: string) { //find all subscriptions
        return this.subscriptions.get(userId) || [];
    }
    
}