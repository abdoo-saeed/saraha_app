import mongoose, { connect } from "mongoose"


export const DBConnection = async ()=>{

    await connect(process.env.DB_URI,{
        serverSelectionTimeoutMS:5000
    })
    .then(()=>{console.log("DB NAME:", mongoose.connection.name);})
    .catch(()=>{console.log("DB can not connect")})
}