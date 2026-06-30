1. Browser connect hota hai (ws://localhost:3001)
   → UserManager.addUser() → User "u1" banta hai

2. Browser bhejta hai: { method: "SUBSCRIBE", params: ["trade@TATA_INR"] }
   → User.addListeners() catch karta hai
   → SubscriptionManager.subscribe("u1", "trade@TATA_INR")
   → Yeh pehla subscriber hai → Redis actual subscribe ho jaata hai

3. (kahin door, Engine mein) koi order match hota hai
   → Engine.publishWsTrades() → Redis publish("trade@TATA_INR", tradeData)

4. Redis se "trade@TATA_INR" pe message aata hai
   → redisCallbackHandler() trigger hota hai
   → reverseSubscriptions.get("trade@TATA_INR") = ["u1", "u2", ...]
   → har user ka emit() call hota hai
   → User.emit() → ws.send(JSON.stringify(tradeData))

5. Browser ke pास message aata hai → chart/orderbook UI live update hoti hai