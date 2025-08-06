import AppError from "../errors/AppError.js";
export const authorize = (...roles) => (req, _res, next) =>
  roles.includes(req.user.role)
    ? next()
    : next(new AppError("Forbidden", 403));