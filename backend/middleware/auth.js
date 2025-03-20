
import {UnAuthorizedError} from '../error/UnAuthorized.js'
import jwt from "jsonwebtoken"
const auth = async (req, res, next) => {
    try {
        
      const token = req.cookies?.token;
      console.log("token", token);
      
      if (!token) {
        throw new UnAuthorizedError("Access denied");
      }
  
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded", decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.log("error", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  };

const verifyTokenAndAuth = async (req, res, next) => {
    auth(req, res, () => {
       
      const { id } = req.params;
      console.log("id",id)
      if (id === req?.user?.userID || req?.user?.role === "manager") {
        next();
      } else {
        next(new UnAuthorizedError("access denied"));
      }
    });
  };

  const verifyTokenAndManager = async (req, res, next) => {
    auth(req, res, () => {
      const { role } = req.user;
      if (role === "manager") {
        next();
      } else {
        next(new UnAuthorizedError("access denied you are not manager"));
      }
    });
  };

  export {auth,verifyTokenAndAuth,verifyTokenAndManager}