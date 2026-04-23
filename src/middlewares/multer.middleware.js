import multer, {diskStorage} from 'multer'
import fs from 'fs/promises'
import path from 'path'




export const fileTypes = {
    images:["image/jpeg","image/png","image/bmp"]
}



//=================================================================================
export const upload = ({dest = 'general',validation= fileTypes.images, size= 5})=>{



    const storage = diskStorage({
///////////////////////////////////////////////////////////////
        destination:async(req,file,cb)=>{    //(1)
            
            const finalPath = `./uploads/${dest}`
            const folderPath = path.resolve(finalPath)// to give the path right
            file.finalPath = finalPath  //upload/users/profileImage
            
        try {
          
          await fs.access(folderPath,fs.constants.F_OK)//(F_OK)this flag to know is file there
          
                
        } catch (error) {
            await fs.mkdir(folderPath,{recursive:true})// make the folder
            console.log({error});
        }
        
          
            cb(null,folderPath)              
        },
//////////////////////////////////////////////////////////////
        filename:(req,file,cb)=>{            //(2)
            
            const fileName = `${Date.now()}-${file.originalname}` //to prevent delete same image when downloaded twice
            // console.log(fileName);
            
            file.finalPath = `${file.finalPath}/${fileName}`; //upload/users/profileImage/name.png
            cb(null,fileName)   // cb(error,fileName) filename from the log
            // console.log({file});
            
            
        }
    })





    //validation for file format
    const fileFilter = (req,file,cb)=>{
    if (validation.includes(file.mimetype)) {
        cb(null,true)  
    }else{
        cb(new Error("in-valid file format"),false)
    }
}





    return multer({
        storage,fileFilter,limits:{
        fileSize: size*1024
    }});
}




