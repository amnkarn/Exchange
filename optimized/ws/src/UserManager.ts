import type WebSocket from "ws";
import { User } from "./User.js";
import { SubscriptionManager } from "./SubscriptionManager.js";


export class UserManager {
    private static instanse: UserManager;
    private users: Map<string, User> = new Map();

    constructor() {

    }

    public static getInstanse() {
        if(!this.instanse) {
            this.instanse = new UserManager();;
        }

        return this.instanse;
    }

    public addUser(ws: any) {
        const id = this.getRandomId();
        const user = new User(id, ws);
        this.users.set(id, user);
        this.registerOnClose(ws, id);
        
        return user;
    }

    public registerOnClose(ws: WebSocket, id: string) {
        ws.on("close", () => {
            this.users.delete(id);
            SubscriptionManager.getInstanse().userLeft(id);
        })
    }

    public getUser(id: string) {
        return this.users.get(id);
    }

    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}