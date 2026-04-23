import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import * as messagesService from "./message.service.js"
import { successRes } from "../../utils/res.handle.js";
const router = Router()




router.post("/send-message",
    upload({dest:"messages", size:100*1024}).array("attachments",5),
    async(req,res)=>{
        console.log(req.files);
        
        const attachments = req.files.map(ele=>ele.finalPath)
        const {to,body}= req.body
        const data = await messagesService.sendMessages({to,body,attachments})

        return successRes({
            res,
            data
        })

    }
)









export default router