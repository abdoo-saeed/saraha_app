import nodemailer from "nodemailer";
import { EMAIL, EMAIL_PASSWORD } from "../../../config/config.service.js";

 


export const sendEmail = async ({ to,cc,bcc, subject, html,attachments =[] }) => {


    // Create a transporter using SMTP
const transporter = nodemailer.createTransport({
service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});



const info = await transporter.sendMail({
    from: `"Saraha App" <${EMAIL}>`,
    to,
    cc,
    bcc,
    subject,
    html,
    attachments
  });



}

