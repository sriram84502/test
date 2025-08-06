import { Router } from "express";
import { body } from "express-validator";
import {
  listUsers,
  getUser,
  verifyUser,
  assign,
} from "../controllers/admin.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { validate } from "../middleware/validate.js";
import { asyncWrap } from "../middleware/asyncWrap.js";

const r = Router();
r.use(authenticate, authorize("admin"));

r.get("/users", asyncWrap(listUsers));
r.get("/users/:id", asyncWrap(getUser));
r.put("/users/:id/verify", asyncWrap(verifyUser));

r.put(
  "/users/:id/assign",
  [
    body("roomNo").notEmpty(),
    body("driverName").notEmpty(),
    body("driverPhone").notEmpty(),
    validate,
  ],
  asyncWrap(assign)
);

export default r;