import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 3001 });
wss.on("connection", (ws) => {
    console.log("wss is connected");
    ws.on("open", (socket) => {
        console.log(socket);
    });
});
//# sourceMappingURL=index.js.map