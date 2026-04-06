import { Ticker } from "./types";

export const BASE_URL = "wss://ws.backpack.exchange/"; //exchange original api


type CallbackFunction = (data: any) => void;

interface RegisteredCallback {
    id: string;
    callback: CallbackFunction;
}

// class to make only one websocket connection
export class SignalingManager {
    private ws: WebSocket;
    private static instance: SignalingManager; //ws connections
    private bufferedMessages: any[] = []; //store all prev requests
    private callbacks: { [type: string]: RegisteredCallback[] } = {}; //like a Diary, store subscriptions of users
    private id: number;
    private initialized: boolean = false;

    // constructor runs when new SignalingManager() is written
    private constructor() {
        this.ws = new WebSocket(BASE_URL); //new connection
        this.bufferedMessages = [];
        this.id = 1;
        this.init(); //called init()
    }

    // create only one connection
    public static getInstance() { //if connection already exist, return that
        if (!this.instance) {
            this.instance = new SignalingManager();
        }
        return this.instance;
    }

    init() {
        // ready signal
        this.ws.onopen = () => {
            this.initialized = true; //show connection "on"
            this.bufferedMessages.forEach(message => { //send all waitlisted req
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = []; //clear waitlist
        }

        // incoming news
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data); //parse the data

            const type = message.data?.e; //confirm the type
            if(!type) return;

            if (this.callbacks[type]) { //if callbacks(subscribers) are the type of ["type"]

                //loop on them
                this.callbacks[type].forEach(({ callback }) => {
                    //map the data according to "tocker"
                    if (type === "ticker") {
                        const newTicker: Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        }

                        callback(newTicker);
                    }

                    if (type === "depth") {
                        const updatedBids = message.data.b;
                        const updatedAsks = message.data.a;
                        callback({ bids: updatedBids, asks: updatedAsks });
                    }
                });
            }
        }
    }

    //send the message to ws or add in waitlist
    sendMessage(message: any) {
        const messageToSend = { //message like "SUBSCRIBE" & id
            ...message,
            id: this.id++
        }
        if (!this.initialized) { //if not initialized or internet is slow
            this.bufferedMessages.push(messageToSend); //add in waitlist
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }

    // add in callbacks to get the informations
    async registerCallback(type: string, callback: CallbackFunction, id: string) {
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({ callback, id });
        // "ticker" => callback
    }

    // remove from callbacks
    async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}