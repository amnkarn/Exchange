import { type MessageFromOrderbook } from "./types/index.js";
import { type MessageToEngine } from "./types/to.js";
export declare class RedisManager {
    private client;
    private publisher;
    private static instance;
    private constructor();
    static getInstance(): RedisManager;
    sendAndAwait(message: MessageToEngine): Promise<MessageFromOrderbook>;
    getRandomClientId(): string;
}
//# sourceMappingURL=RedisManager.d.ts.map