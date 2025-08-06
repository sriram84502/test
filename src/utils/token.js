import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TTL,
    algorithm: "HS256",
  });

export const signRefresh = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TTL,
    algorithm: "HS256",
  });

export const verifyAccess = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefresh = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);