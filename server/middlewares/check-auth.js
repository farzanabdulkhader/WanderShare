import HttpError from "../utils/http-error.js";
import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication Faileddd!");
    }
    const decodedToken = jwt.verify(token, process.env.production.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError("Authentification failedsss!", 401);
    return next(error);
  }
};

export default checkAuth;
