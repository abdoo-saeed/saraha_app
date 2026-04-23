import { create, findById } from "../../DB/db.repo.js"
import { messageModel } from "../../DB/models/messageModel.js";
import { userModel } from "../../DB/models/userModel.js";
import { errorRes } from "../../utils/res.handle.js";




export const sendMessages=async({to,body,attachments})=>{
    const user = await  findById({model:userModel, id : to})

    if(!user){
       return errorRes({message:"user not found",status:404})
    }

    const message = await create({
        model:messageModel,
        data:{
            to:user._id,
            body,
            attachments
        }
    })

    return {
        data:[
            message
        ]
    }
}