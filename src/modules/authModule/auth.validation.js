import joi from 'joi'
import { Gender, logout, roles } from '../../DB/enums/user.enums.js'




export const signUpSchema = { body: joi.object({
    username:  joi.string().min(10).max(30).custom((value,helpers)=>{
        const [firstName,lastName] = value.split(' ')
        if(!firstName || !lastName){
            return helpers.message('username must be contain 2 names has space inbetween')
        }else{
            return value
        }
    }).required(),
    email: joi.string().email().required(),
    password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!_%^&*])(?=.*[0-9])(?!.*\s).{8,}$/).required(),
    repeatPassword:joi.string().valid(joi.ref('password')).required(),//refrence to password
    gender: joi.number().valid(...Object.values(Gender)), //valid to access enum,... to spread the array
    age: joi.number().min(12).max(100),
    phone: joi.string().regex(new RegExp(/^0?1[0125]\d{8}$/)).min(10).max(11),
    role: joi.number().allow(...Object.values(roles)) //allow like valid but it can take condition
})
}


export const loginSchema = {
// then schema has body and params and can have query too
    body: joi.object({
         email: joi.string().email().required(),
        password: joi.string().min(8).required(),
    }),
    query: joi.object({
        name: joi.string().min(3).max(15).required()
    })
 
}    


export const logoutSchema = {
    body: joi.object({
        flag:joi.string().valid(...Object.values(logout)).required()
    })
}