import { verifyAccess } from "../utils/token.js";
import AppError from "../errors/AppError.js";
export const authenticate = (req, _res, next) => {
  const bearer = req.headers.authorization?.split(" ")[1];
  const token = req.cookies.at || bearer;
  if (!token) return next(new AppError("No token", 401));
  try {
    req.user = verifyAccess(token);
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};