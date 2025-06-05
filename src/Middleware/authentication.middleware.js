import blackListTokenModel from "../DB/Models/black-list-token.model.js";
import jwt from "jsonwebtoken";
import userModel from "../DB/Models/user.model.js";
//(req,res,next)=>{}
// export const authenticationMiddleware = async (req, res, next) => {}; // can't send parameters to the next function

export const authenticationMiddleware = () => {
  return async (req, res, next) => {
    const { accesstoken } = req.headers;
    if (!accesstoken)
      return res.status(400).json({ message: "please login first" });

    // verify token
    const decodedToken = jwt.verify(accesstoken, process.env.JWT_ACCESS_KEY);

    // check if token is revoked
    const isTokenRevoked = await blackListTokenModel.findOne({
      tokenId: decodedToken.jti,
    });
    if (isTokenRevoked) {
      return res.status(401).json({ message: "please login first" });
    }

    // get user data from database
    // critical data will be excluded from the request object when fethching data from the database
    // and sent to the next middleware

    const user = await userModel.findById(
      decodedToken._id,
      "_id email phone role"
    );
    if (!user) {
      return res.status(401).json({ message: "please signup first" });
    }
    //*********************//
    // next(); // only failed cases will be passed in (next) as a parameter to the next middleware
    // instead of using (next) we add a key to request object to be accessed in the next middleware
    // can't send all data of user to the next middleware
    // critical data will be excluded from the request object when fethching data from the database
    //*********************//

    req.authenticatedUser = user; // adding user to the request object

    // adding token data as a key to user object
    req.authenticatedUser.token = {
      tokenId: decodedToken.jti,
      expiresAt: decodedToken.exp,
    };

    next();
  };
};
