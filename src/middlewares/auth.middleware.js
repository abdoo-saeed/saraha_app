import { errorRes } from '../utils/res.handle.js'
import { decodedToken } from '../utils/security/token.security.js'



export const auth = async (req,res,next) =>{

    const authorization = req.headers.authorization

    const {user,decoded} = await decodedToken({token:authorization})
    req.user = user
    req.decoded = decoded
    next()

}


export const checkRole = (roles = []) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!roles.includes(user.role)) {
      return errorRes({
        res,
        message: "Not authorized",
        status: 401
      });
    }

    next();
  };
};