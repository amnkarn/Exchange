import { User } from "./User.js";


export class UserManager {
    private static instanse: UserManager;
    private users = new Map<string, User>();

    constructor() {

    }

    public static getInstanse() {
        if(!this.instanse) {
            this.instanse = new UserManager();;
        }

        return this.instanse;
    }

    public static addUser(ws: any) {
        const id = this.getRandomId();
        const user = new User(id, ws);
    }

    public getUser(id: string) {
        
    }

    private static getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}