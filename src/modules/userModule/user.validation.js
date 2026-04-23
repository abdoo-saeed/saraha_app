import joi from "joi"
import { fileTypes } from "../../middlewares/multer.middleware.js"






export const profileImageSchema ={
    file:joi.object({
            "fieldname": joi.string().valid("image").required(),
            "originalname": joi.string().required() ,
            "encoding": joi.string().required(),
            "mimetype": joi.string().valid(...fileTypes.images).required(),
            "finalPath": joi.string().required(),
            "destination": joi.string().required(),
            "filename": joi.string().required(),
            "path": joi.string().required(),
            "size":joi.number().required()
    })

}
export const coverImageSchema ={
    file:joi.object({
            "fieldname": joi.string().valid("coverImages").required(),
            "originalname": joi.string().required() ,
            "encoding": joi.string().required(),
            "mimetype": joi.string().valid(...fileTypes.images).required(),
            "finalPath": joi.string().required(),
            "destination": joi.string().required(),
            "filename": joi.string().required(),
            "path": joi.string().required(),
            "size":joi.number().required()
    })

}