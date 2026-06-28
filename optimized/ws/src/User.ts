import type WebSocket from "ws";
import { SubscriptionManager } from "./SubscriptionManager.js";
import type { OutgoingMessage } from "./types/out.js";
import { SUBSCRIBE, UNSUBSCRIBE, type IncommingMessage } from "./types/in.js";


export class User {
    private id: string;
    private ws: WebSocket;
    private subscriptions: string[] = [];

    constructor(id: string, ws: WebSocket) {
        this.id = id;
        this.ws = ws;
        this.addListeners();
    }

    emit(message: OutgoingMessage) {
        this.ws.send(JSON.stringify(message));
    }

    public subscribe(subscription: string) {
        this.subscriptions.push(subscription);
    }

    public unsubscribe(subscription: string) {
        this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    }

    public addListeners() {
        this.ws.on("message", (message: string) => {
            const parsedMessage: IncommingMessage = JSON.parse(message);

            if(parsedMessage.method === SUBSCRIBE) {
                parsedMessage.params.forEach((s) => {
                    SubscriptionManager.getInstanse().subscribe(this.id, s);
                })
            }

            if(parsedMessage.method === UNSUBSCRIBE) {
                parsedMessage.params.forEach((s) => {
                    SubscriptionManager.getInstanse().unsubscribe(this.id, s);
                })
            }
        })
    }
}