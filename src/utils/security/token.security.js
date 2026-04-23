import jwt, { decode } from "jsonwebtoken";
import {
  ADMIN_REFRESH_SECRET_KEY,
  ADMIN_TOKEN_SECRET_KEY,
  TOKEN_START,
  USER_REFRESH_SECRET_KEY,
  USER_TOKEN_SECRET_KEY,
} from "../../../config/config.service.js";
import { findById } from "../../DB/db.repo.js";
import { userModel } from "../../DB/models/userModel.js";
import { roles } from "../../DB/enums/user.enums.js";
import { errorRes } from "../res.handle.js";
import { revokedTokenModel } from "../../DB/models/revokedTokenModel.js";
import { get, revokedTokenKey } from "../../DB/redis.services.js";

//=================================================================================================

export const generateToken = ({
  payload,
  role = roles.user,
  options = {},
  tokenType = "access",
}) => {
  let secretKey;
  switch (tokenType) {
    case "access":
      secretKey =
        role == roles.user ? USER_TOKEN_SECRET_KEY : ADMIN_TOKEN_SECRET_KEY;
      break;

    case "refresh":
      secretKey =
        role == roles.user ? USER_REFRESH_SECRET_KEY : ADMIN_REFRESH_SECRET_KEY;
      break;

    default:
      break;
  }

  return jwt.sign({ ...payload, aud: role }, secretKey, options);
};

//============================================================================
export const verifyToken = ({ token, role, tokenType = "access" }) => {
  let secretKey;
  switch (tokenType) {
    case "access":
      secretKey =
        role == roles.user ? USER_TOKEN_SECRET_KEY : ADMIN_TOKEN_SECRET_KEY;
      break;

    case "refresh":
      secretKey =
        role == roles.user ? USER_REFRESH_SECRET_KEY : ADMIN_REFRESH_SECRET_KEY;
      break;

    default:
      break;
  }

  return jwt.verify(token, secretKey);
};

//======================================================================
export const decodedToken = async ({ token, tokenType = "access" }) => {
  const [start, authorization] = token.split(" ");

  if (start != TOKEN_START) {
    errorRes({ message: "invalid token" });
  }

  const payload = jwt.decode(authorization);
  const decoded = verifyToken({
    token: authorization,
    role: payload.aud,
    tokenType,
  });

  //redis condition
  const isRevoked = await get({
    key: revokedTokenKey({ userId: decoded._id, jti: decoded.jti }),
  });
  // console.log(isRevoked);
  if (isRevoked) {
    errorRes({ message: "in-valid login session, try agian ", status: 401 });
  }

  let user;
  if (decoded._id) {
    user = await findById({
      model: userModel,
      id: decoded._id,
    });

    if (!user) {
      errorRes({ message: "user not found", status: 404 });
    }

    if (!user.confirmEmail) {
      errorRes({ message: "email not confirmed yet" });
    }

    // mongo db condition
    //  if(await revokedTokenModel.findOne({iti:decoded.iti})){
    //     errorRes({message:"invalid login session",status:400})
    //  }

    //redis condition
    const isRevoked = await get({
      key: revokedTokenKey(user._id),
    });

    if (
      user.credential_changedAt &&
      user.credential_changedAt.getTime() >= decode.iat * 1000
    ) {
      errorRes();
    }
  } else {
    errorRes({ message: "in-valid token", status: 409 });
  }

  return { user, decoded };
};
