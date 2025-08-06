import { Router } from "express";
import {
  getMe,
  updateMe,
  downloadBundle,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";
import { canEdit } from "../middleware/canEdit.js";

const r = Router();

r.get("/me", authenticate, getMe);
r.put("/me", authenticate, canEdit, updateMe);
r.get("/me/download", authenticate, downloadBundle);

export default r;