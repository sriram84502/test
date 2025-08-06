import { validationResult } from "express-validator";
import AppError from "../errors/AppError.js";
export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.param, msg: e.msg }));
    return next(new AppError("Validation failed", 422, details));
  }
  next();
};