
import { model, Schema, Types } from "mongoose";



const schema = new Schema({
    body:{
        type:String,
        required:function(){
                    if(this.attachments.length == 0){
                       return true
                    }else{
                       return false
                    }
                 },

    },
    attachments:[{
        type:String,
    }],
    to:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    }
},{
     timestamps:true,
       toJSON:{
        virtuals:true,
        getters:true 
       },
       toObject:{
        virtuals:true,
        getters:true
       },
       strictQuery:true,
       strict:true,
       validateBeforeSave:true,
       optimisticConcurrency:true
})



export const messageModel = model("message",schema)