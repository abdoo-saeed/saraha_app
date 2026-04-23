import { Router } from "express";
import { upload } from "../../middlewares/multer.middleware.js";
import { successRes } from "../../utils/res.handle.js";
import { auth } from "../../middlewares/auth.middleware.js";
import * as service from "./user.service.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { coverImageSchema, profileImageSchema } from "./user.validation.js";

const router = Router();






router.get('/', (req, res, next) => {
    res.json({ msg: "hello from users module" })
})



router.patch("/user-profile",
    auth,
    upload({dest:"users/profileImage", size:100*1024}).single("image"),
    validation(profileImageSchema),
    async(req,res,next)=>{
   

        
        
console.log(req.file);

     
     await service.profileImageService({user:req.user , path:req.file.finalPath})
    
    return successRes({res})

})



router.patch(
    '/cover-images',
    auth,
    validation(coverImageSchema),
    upload({ dest: 'users/coverImages' , size:20 *1024}).array("coverImages", 4),
    async (req, res, next) => {

        const paths = req.files.map(ele => ele.finalPath);
        // console.log(paths);

        await service.coverImageService({ user: req.user, paths });

        // console.log(req.files);
        
        return successRes({
            res,
            data: req.files
        });
    }
);




router.delete(
    "/del-user-profile",
    auth,
    async (req, res, next) => {

        await service.deleteProfileImageService({ user: req.user });

        return successRes({
            res,
            message: "Profile image deleted successfully"
        });

    }
);



export default router