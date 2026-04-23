import { EventEmitter } from "events"
import { sendEmail } from "./send.email.js"
import { emailTemplate } from "./templete.email.js"

export const emailEmitter = new EventEmitter()


emailEmitter.on("Send OTP",({
    email,
    code,
    title,
    expiredTime

      })=>{

   sendEmail({
            to:email,
            subject:'Send OTP',
            html: emailTemplate({code , title ,expiredTime})
             
        })
})