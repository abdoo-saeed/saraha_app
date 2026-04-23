import { findOne } from "../../DB/db.repo.js"
import { userModel } from "../../DB/models/userModel.js"
import { errorRes } from "../../utils/res.handle.js"
import { compare, hash } from "../../utils/security/hash.security.js"
import { generateDncryption, generateEncryption } from "../../utils/security/encryption.security.js"
import { decodedToken, generateToken} from "../../utils/security/token.security.js"
import {OAuth2Client} from 'google-auth-library'
import { logout, provider } from "../../DB/enums/user.enums.js"
import crypto from "crypto"
import { confirmEmailKeyPrefix, deletByKey, forgetPassKeyPrefix, get, getTtl, revokedTokenKey, set, update } from "../../DB/redis.services.js"
import { emailEmitter, generateOTP} from "../../utils/index.js"
import { findByEmail } from './../../DB/db.repo.js';





//=====================================================================================

const client = new OAuth2Client()



export const signUp = async ({username,password,email,gender,age,phone})=>{

    const isEmailExist = await findOne(
        {
            model:userModel,
            filter:{email},

        }
    )
    if(isEmailExist){
        errorRes({message:"email already exist",status:400})
    }
 
    let hashedPass
    if(password){
        hashedPass =await hash({text: password , target: "argon2"})//to hash the password
    }


    const user = await userModel.create({
            username,
            password:hashedPass,
            email,
            gender,
            age,
            phone:await generateEncryption(phone),
        })


    
       const code =generateOTP()

       await set({
        key:confirmEmailKeyPrefix({userId:user._id}),
        value:{
            otp: await hash({text:code}),
            attempts:1,
        },
        ttl: 300  // 5 minutes
    })


    emailEmitter.emit("Send OTP",{
        email,
        code,
        title:"Confirm Email",
        expiredTime:"5 Minutes"
    })
        


        
    return {
        data:{
            message:"success",
            data:user
        }
    }
} 


export const confirmEmail = async ({email,otp})=>{

    const user = await findByEmail({email})

    if(!user){
        errorRes({message:"user not found",status:404})
    }
    if(user.confirmEmail){
        errorRes({message:"user already confirmed"})
    }


    const otpKey = confirmEmailKeyPrefix({userId:user._id}) 
    const otpData =JSON.parse(await get({key:otpKey}))

    if(!otpData){
        errorRes({message:"otp not found"})
    }

    if(otpData.attempts > 5){
        const ttl = await getTtl(otpKey)
        errorRes({message:`retry after : ${Math.ceil(ttl/60)} minutes`})
    }

    if(! await compare({text:otp , cipherText:otpData.otp})){
        await update({
            key:otpKey,
            value:{
                otp:otpData.otp,
                attempts:otpData.attempts + 1
            },
            ttl:await getTtl(otpKey)
        })
        errorRes({message:"in-valid otp try again"})
    }

  //==== user confirmed his email =====
    await deletByKey(otpKey)
    user.confirmEmail = true
    await user.save()

    return {
        data:{}
    }

}


export const resendOtp = async ({email})=>{

     const user = await findByEmail({email})

    if(!user){
      return  errorRes({message:"user not found",status:404})
    }
    if(user.confirmEmail){
       return errorRes({message:"user already confirmed"})
    }

        const otpKey = confirmEmailKeyPrefix({userId:user._id}) 
        const otpData =await get({key:otpKey})

     if(otpData){
       const ttl =await getTtl(otpKey)
       if(ttl > 240){
       return errorRes({message:'wait minute to resend otp'})
       }
    }

    //=== resend the otp 
    await deletByKey(otpKey)

       const code =generateOTP()

       await set({
        key:otpKey,
        value:{
            otp: await hash({text:code}),
            attempts:1,
        },
        ttl: 300  // 5 minutes
    })


    emailEmitter.emit("Send OTP",{
        email,
        code,
        title:"Resend Confirm Email",
        expiredTime:"5 Minutes"
    })
    
        
    return {
        data:{
            message:"success",
            data:{}
        }
    }



}


export const forgetPassword = async ({email})=>{

    const user = await findByEmail({email})

    if(!user){
      return errorRes({message:"user not found",status:404})
    }
    if(!user.confirmEmail){
       return errorRes({message:"email not confirmed "})
    }

   const otpKey = forgetPassKeyPrefix({userId:user._id})
   const otpData =await get({key:otpKey})

     if(otpData){
       const ttl =await getTtl(otpKey)
       if(ttl > 240){
       return errorRes({message:'wait minute to resend otp'})
       }
    }

    //=== resend the otp 
    await deletByKey(otpKey)

    const code =generateOTP()

       await set({
        key:otpKey,
        value:{
            otp: await hash({text:code}),
            attempts:1,
        },
        ttl: 300  // 5 minutes
    })


    emailEmitter.emit("Send OTP",{
        email,
        code,
        title:"forget password otp",
        expiredTime:"5 Minutes"
    })
    
        
    return {
        data:{
            message:"success",
            data:{}
        }
    }


   

}


export const resetPassword = async ({email,otp,password})=>{

     const user = await findByEmail({email})

    if(!user){
       return errorRes({message:"user not found",status:404})
    }
    if(!user.confirmEmail){
       return errorRes({message:"email not confirmed"})
    }


    const otpKey = forgetPassKeyPrefix({userId:user._id}) 
    let otpData =await get({key:otpKey})

    if(!otpData){
       return errorRes({message:"otp not found"})
    }
    otpData = JSON.parse(otpData)
    if(otpData.attempts > 5){
        const ttl = await getTtl(otpKey)
       return errorRes({message:`retry after : ${Math.ceil(ttl/60)} minutes`})
    }

    if(! await compare({text:otp , cipherText:otpData.otp})){
        await update({
            key:otpKey,
            value:{
                otp:otpData.otp,
                attempts:otpData.attempts + 1
            },
            ttl:await getTtl(otpKey)
        })
       return errorRes({message:"in-valid otp try again"})
    }

  //==== user reset his password =====
    await deletByKey(otpKey)

    const hashedPassword =await hash({text:password})
    user.password = hashedPassword
    await user.save()
    return {
        data:{}
    }


}



export const login = async({email,password})=>{
    const user = await findByEmail({email , select:"provider firstName lastName username  password phone"})
    if(!user){
        errorRes({
            message:"in_valid credentials"
        })
    }

    if(!(user.provider==provider.system)){
        errorRes({
            message:"use google login"
            
        })
    }

    if(!user.confirmEmail){
        errorRes({message:"email not confirmed yet",status:409})
    }
    
    if(!(await compare({text: password ,cipherText: user.password ,target: 'argon2'}))){
        errorRes({ 
            message:"in_valid credentials"
        })
    }

    user.phone = await generateDncryption(user.phone)




    const jwtid = crypto.randomUUID() // make it global to revoked access & refresh
    const accessToken = generateToken({
        payload:{_id:user._id},
        role:user.role,
        options:{
            expiresIn:"1d",
            jwtid  //same key same value
        }

    }) 

    const refreshToken = generateToken({
        payload:{_id:user._id},
        role:user.role,
        options:{
            expiresIn:"1w",
            jwtid
        },
        tokenType: 'refresh' 

    }) 

  
    // console.log(accessToken);
    
    return{
        data:{
        accessToken,
        refreshToken
        }

    }
}


export const refreshToken = async({refreshToken})=>{

    

       const {user} = await decodedToken({token:refreshToken,tokenType:"refresh"})
   
        const accessToken = generateToken({
            payload:{_id:user._id},
            role:user.role,
            options:{expiresIn:30*60},


        })
        
        return {
            data:{
                accessToken
            }
        }
}



export const getUserProfile = async({id})=>{

   
    
 return{
    data:
    profile
 }

}


///=====google signup==============================================
export const googleSignup = async ({googleToken})=>{
   
    const ticket = await client.verifyIdToken({
      idToken:googleToken,//from google console
      audience:"845835650057-2auqeinkesffekjgu56uot2via5g1j5s.apps.googleusercontent.com", //from google console
       // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const {name,email} = ticket.getPayload();
//   console.log({name,email});

  const isEmailExist = await findByEmail({email,email_verified})

  let accessToken
  let refreshToken
  
  if(isEmailExist){

    if(isEmailExist.provider==provider.system){
        errorRes({
            message:"use system login"
            
        })
    }

    //login logic
      accessToken = generateToken({
        payload:{_id:isEmailExist._id},
        role:isEmailExist.role,
        options:{expiresIn:30*60}

    }) 

    refreshToken = generateToken({
        payload:{_id:isEmailExist._id},
        role:isEmailExist.role,
        options:{expiresIn:'1W'},
        tokenType: 'refresh' 

    }) 


  }else{
     //signup logic 
    const user = await userModel.create({
            username:name,
            email,
            provider:provider.google,
            confirmEmail: email_verified 
        })


        accessToken = generateToken({
        payload:{_id:user._id},
        role:user.role,
        options:{expiresIn:30*60}

    }) 

    refreshToken = generateToken({
        payload:{_id:user._id},
        role:user.role,
        options:{expiresIn:'1W'},
        tokenType: 'refresh' 

    }) 

  }


  return{
    data:{
    accessToken,
    refreshToken
    }
  }
}




export const logoutService = async ({user,iat,jti,flag = logout.all})=>{

    if(flag==logout.all){
        user.credential_changedAt = Date.now()
        await user.save()

    }else{   //only this device
       
        await set({
                key:revokedTokenKey({userId:user._id , jti }),
                 value:jti , 
                 ttl: (7* 24 * 60 * 60)
                })
    }


    return {
        data:{}
    }
}