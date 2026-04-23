
import crypto from 'node:crypto'
import { ENC_SECRET_KEY, IV_LENGTH } from '../../../config/config.service.js'






export const generateEncryption = async (plainText)=>{
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipherIV = crypto.createCipheriv('aes-256-cbc',ENC_SECRET_KEY,iv)
    let cipherText = cipherIV.update(plainText,'utf-8','hex')
   cipherText += cipherIV.final('hex')
//    console.log({iv,cipherIV,cipherText});

   return `${iv.toString('hex')}:${cipherText}`
   
    

}


export const generateDncryption = async (cipherText)=>{

   if (!cipherText) {
        throw new Error("Encrypted text is required for decryption")
    }

    const parts = cipherText.split(":")

    if (parts.length !== 2) {
        throw new Error("Invalid encrypted format")
    }

    const [iv, encryptedData] = parts
    const ivLikeBinary = Buffer.from(iv,'hex')
    let decipherIV = crypto.createDecipheriv('aes-256-cbc', ENC_SECRET_KEY,ivLikeBinary)
    let plainText = decipherIV.update(encryptedData,'hex','utf-8')
    plainText += decipherIV.final('utf-8')
    
    // console.log({iv,encryptedData,ivLikeBinary,decipherIV,plainText});
    return plainText
}