import { redisClient } from "./redis.connection.js"


// when i want to delete all
export const revokedTokenPrefix = ({userId})=>{ // user:revokedToken:id
    return `user:${userId}:revokedToken`

}
export const revokedTokenKey = ({userId,jti})=>{ // user:revokedToken:id
    return `${revokedTokenPrefix({userId})}:${jti}`

}
export const confirmEmailKeyPrefix = ({userId})=>{ // user:revokedToken:id
    return `user:${userId}:confirmEmail`

}
export const forgetPassKeyPrefix = ({userId})=>{ // user:revokedToken:id
    return `user:${userId}:forgetPassword`

}



export const set = async ({key, value, ttl=null})=>{
    try {
        const data  = typeof value != "string" ? JSON.stringify(value) : value

        if(ttl){
          return await redisClient.set(key,data,{
            expiration:{type:"EX",value:ttl}
          })
        }else{
         return await redisClient.set(key,data,ttl)
        }

    } catch (error) {
        console.log('redis set error : ',error);
        
    }
}



export const get = async ({key})=>{
    try {
        const data = await redisClient.get(key)
        return data

    } catch (error) {
         console.log('redis get error : ',error);
    }
}




export const update = async ({key, value, ttl=null})=>{
    try {
        const isExist = await redisClient.exists(key)
        if (!isExist) {
            return false
        }
        return await set({key,value,ttl})
        
    } catch (error) {
        console.log('redis update error : ',error);
    }
}




export const deletByKey = async (key)=>{
    try {
       return await redisClient.del(key)
    } catch (error) {
         console.log('redis delete error : ',error);        
    }
}



export const expire = async ({key,ttl})=>{
    try {
       return await redisClient.expire(key,ttl)
    } catch (error) {
         console.log('redis expire error : ',error);        
    }
}



export const getTtl = async (key)=>{
    try {
       return await redisClient.ttl(key)
    } catch (error) {
         console.log('redis ttl error : ',error);        
    }
}





export const getKeyByPrefix = async (prefix)=>{
    try {
       return await redisClient.keys(prefix)
    } catch (error) {
         console.log('redis get error : ',error);        
    }
}