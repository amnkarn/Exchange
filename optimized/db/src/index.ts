import { Client } from "pg";
import { createClient } from "redis";

const pgClient = new Client({
    user: 'your_user',
    host: 'localhost',
    database: 'my_database',
    password: 'your_password',
    port: 5432,
})

pgClient.connect();

async function main() {
    const redisClient = createClient();
    await redisClient.connect();
    console.log("connected to redis");

    while(true) { //infinite loop
        //pull message from redis queue
        const response = await redisClient.rPop("db_processor" as string);
        if(!response) {
            console.log("redis db_processor right pop failed");
        } else {
            const data = JSON.parse(response);

            if(data.type === "TRADE_ADDED") {
                console.log("adding data");
                console.log(data);

                const price = data.data.price;
                const timeStamp = new Date(data.data.timestamp);
                const query = 'INSERT INTO tata_prices (time, price) VALUES ($1, $2)';
                const values = [timeStamp, price];
                await pgClient.query(query, values);
            
            } else if(data.type === "ORDER_UPDATE") {
                console.log("updating trade");
                console.log(data);
                
            } 
        }
    }
}

main();