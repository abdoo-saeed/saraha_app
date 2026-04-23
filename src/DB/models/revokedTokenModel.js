import mongoose,{model} from "mongoose";



const schema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },

    jti:{
        type:String,
        required:true
    },
    expireIn:{
        type:Date,
        required:true
    }

},{
    Timestamps:true
})


schema.index("expireIn",{
    expireAfterSeconds:0  //remove from db after token expire 
}) 


export const revokedTokenModel = model("revokedTokens",schema)