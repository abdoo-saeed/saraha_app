import { Router } from "express";
import * as authService from "./auth.service.js";
import { successRes } from "../../utils/res.handle.js";
import { auth, checkRole } from "../../middlewares/auth.middleware.js";
import { roles } from "../../DB/enums/user.enums.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { loginSchema, logoutSchema, signUpSchema } from './auth.validation.js';


//=================================================================================================


/**
 
 * for validation 
 * joi => js => we will work with it 
 * express validator => backend only
 * zod =>ts
 * class validator =>decorater =>ts => nestJs
 * 
 */





const router = Router();






router.get('/', (req, res, next) => {
    res.json({ msg: "hello from users module" })
})


router.post("/signUp",validation(signUpSchema),async (req,res,next)=>{

    const {username,password,email,gender,age,phone} = req.body

    //the place the validation done 

    const {data} = await authService.signUp({username,password,email,gender,age,phone})

    successRes({
        res,
        data:{...data},
        status:201
    })

})


router.patch("/confirm-email",async(req,res,next)=>{
     const {otp,email }= req.body
     const data = await authService.confirmEmail({email,otp})
     successRes({res,data})

})

router.patch("/resend-confirm-email",async(req,res,next)=>{
     const {email }= req.body
     const data =await authService.resendOtp({email})
     successRes({res,data})

})

router.patch("/forget-password",async(req,res,next)=>{
    const {email} = req.body
    const data = await authService.forgetPassword({email})
    successRes({res,data})

})
router.patch("/reset-password",async(req,res,next)=>{
    const {email,otp,password} = req.body
    const data =await authService.resetPassword({email,otp,password})
    successRes({res,data})

})



router.post('/otp-verify', async(req,res,next) => {
  

    const result = await authService.verifyOTPService(req.body);

    successRes({
        res,
        data:result,
        status:200    
    })
  
})





router.post("/login",validation(loginSchema),async (req,res,next)=>{

    const {email,password} = req.body
    const {data} = await authService.login({email,password})

    successRes({
        res,
        data,
    })

})



router.get("/profile",auth,checkRole([roles.user]),async (req,res)=>{

    successRes({
        res,
        data:req.user
    })

})



router.post('/refresh-Token',async (req,res,next)=>{

    const {data} = await authService.refreshToken({refreshToken:req.headers.authorization})
    //  console.log(data);
     

    return successRes({res,data})
})


//=========google signup====================================
router.post("/signup/gmail",async (req,res)=>{

    const {idToken} = req.body
   const {data} = await authService.googleSignup({googleToken:idToken})
    successRes({
        res,
        data
    })
})


router.patch("/logout",auth,validation(logoutSchema),async(req,res,next)=>{

    const {flag} = req.body
    // console.log(req.user);
    
    const {data} = await authService.logoutService({
        user:req.user,
        iat:req.decoded.iat,
        jti:req.decoded.jti,
        flag
    })

    successRes({res})

})




export default router


