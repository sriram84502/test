import AppError from "../errors/AppError.js";
export const canEdit = (req, _res, next) => {
  if (req.user.role !== "user") return next();
  if (Date.now() > new Date(req.user.editableUntil))
    return next(new AppError("Edit window closed", 403));
  next();
};