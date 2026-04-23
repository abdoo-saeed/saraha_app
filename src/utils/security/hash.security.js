import bcrypt from 'bcrypt'
import * as argon2 from 'argon2'


export const hash = async({text,target})=>{
    let cipherText
    switch (target) {
        case argon2:
            cipherText = await argon2.hash(text)
            break;
    
        default:
            cipherText = await bcrypt.hash(text,12)
            break;
    }

     
    return cipherText

}
export const compare = async({text,cipherText,target})=>{
    let result
    switch (target) {
        case argon2:
            result = await argon2.verify(cipherText,text)
            break;
    
        default:
            result = await bcrypt.compare(text,cipherText)
            break;
    }

     
    return result

}


