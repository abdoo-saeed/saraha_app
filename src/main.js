import express from 'express'
import userRouter from './modules/userModule/user.controller.js'
import authRouter from './modules/authModule/auth.controller.js'
import { DBConnection } from './DB/db.connection.js'
import cors from 'cors'
import { redisConnect } from './DB/redis.connection.js'
import messageRouter from './modules/messages/message.controller.js'


// import { config } from 'dotenv'
// import path from 'node:path'
// config({ path: path.resolve('.', 'config/.env') })

const main = async () => {
    const app = express()
    app.use(express.json())
    app.use(cors())
    const PORT = process.env.PORT
  await redisConnect()
  await DBConnection()




    app.use('/uploads',express.static('./uploads')) // to make it path to use in url 
    app.use("/auth",authRouter)
    app.use("/users", userRouter)
    app.use("/message",messageRouter)




    
    

    app.all('{/*dummy}', (req, res, next) => {
        return next(new Error(`page ${req.url} with method ${req.method} not found`));
    })

    app.use((err, req, res, next) => {
        console.log("aaaaa");
        
        if (err) {
            return res.status(err.cause?.status || 500).json({
                status: err.cause?.status || 500,
                errMsg: err.message,
                stack: err.stack
            });
        }
    })

    app.listen(PORT, () => {
        console.log("server running on port=> ", PORT);
    })

}


export default main