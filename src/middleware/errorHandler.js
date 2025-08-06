// src/middleware/errorHandler.js
import AppError from "../errors/AppError.js";
import multer from "multer";

export const errorHandler = (err, _req, res, _next) => {
  // ─── Convert Multer errors ────────────────────────────────
  if (err instanceof multer.MulterError) {
    let msg = err.message;
    let status = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      status = 413; // Payload Too Large
      msg = "File exceeds 2 MB limit";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      status = 415;
      msg = "Unexpected field name";
    }

    err = new AppError(msg, status);
  }

  // ─── Normalize any non-AppError into AppError(500) ────────
  const e = err instanceof AppError ? err : new AppError("Server error");

  if (process.env.NODE_ENV !== "production") console.error(err);

  res.status(e.statusCode).json({
    message: e.message,
    details: e.details ?? undefined,
  });
};