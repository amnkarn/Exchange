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




###
1. Browser → ws connect karta hai
             index.ts → UserManager.addUser(ws)
             UserManager → new User(id, ws) banata hai, apni map mein rakhta hai

2. Browser → SUBSCRIBE message bhejta hai { method: "SUBSCRIBE", params: ["trade@TATA_INR"] }
             User ka ws.on("message") callback fire hota hai
             → SubscriptionManager.subscribe(userId, "trade@TATA_INR")
             → Internal maps update hoti hain
             → Agar pehla subscriber hai → redisClient.subscribe("trade@TATA_INR", handler)
             → Ab Redis sun raha hai us channel ko

3. (Kahin alag — Engine service mein) Order match hota hai
             Engine → RedisManager.publishMessage("trade@TATA_INR", tradeData)
             → Engine ka Redis client publish karta hai

4. Redis → SubscriptionManager ka redisCallbackHandler automatically fire
             channel = "trade@TATA_INR"
             reverseSubscriptions se userIds nikalo → ["userId1", "userId2"]
             har userId ke liye → UserManager.getUser(id) → user.emit(data)
             → ws.send() → Browser screen pe live update ✓

5. Browser disconnect hota hai
             ws.on("close") fire → UserManager.registerOnClose()
             → users.delete(id)
             → SubscriptionManager.userLeft(id)
             → subscriptions se hata do
             → agar last subscriber tha → redisClient.unsubscribe("trade@TATA_INR")