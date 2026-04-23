import {createClient} from 'redis'


export const redisClient = createClient({url:"redis://localhost:6379"})

export const redisConnect = async ()=>{
    try {
        redisClient.connect()
        console.log("redis connected successfully");
        
    } catch (error) {

        console.log("redis connection faild");
        
    }
}
