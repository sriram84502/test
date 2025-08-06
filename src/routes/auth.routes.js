import { Router } from "express";
import { body } from "express-validator";
import {
  registerStage1,
  registerStage2,
  login,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncWrap } from "../middleware/asyncWrap.js";

const r = Router();

r.post(
  "/register-1",
  [
    body("username").isLength({ min: 3 }).withMessage("Min 3 chars"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isStrongPassword({ minSymbols: 1 })
      .withMessage("Weak password"),
    validate,
  ],
  asyncWrap(registerStage1)
);

r.post("/register-2", authenticate, asyncWrap(registerStage2));

r.post(
  "/login",
  [body("username").notEmpty(), body("password").notEmpty(), validate],
  asyncWrap(login)
);

r.post("/refresh", asyncWrap(refreshToken));
r.post("/logout", asyncWrap(logout));

export default r;