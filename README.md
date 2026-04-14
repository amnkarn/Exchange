Trading mein lakhon orders aate hain. 
Agar API server khud hi order match karne baith gaya, toh server "hang" ho jayega.

API ka kaam: Sirf request lena aur queue mein daalna.
Engine ka kaam: Sirf math calculate karke order match karna.
sendAndAwait in dono alag-alag duniya ko jodta hai. 
API request bhej kar bhool nahi jata, balki intezaar (Await) karta hai jab tak Engine reply na karde.

# Summary (Asli Flow)API: 
    sendAndAwait call karo.
    Redis: Order queue mein gaya.
    Engine: Order uthaya --> Match kiya --> Result Publish kiya usi id par.
    API: Result suna --> Resolve kiya --> User ko screen par dikha "Order Successful!".