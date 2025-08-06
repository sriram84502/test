import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  upload,
  handleUploadFront,
  handleUploadBack,
  downloadImage          // ← add
} from "../controllers/upload.controller.js";
import { asyncWrap } from "../middleware/asyncWrap.js";

const r = Router();

r.post("/front", authenticate, upload, asyncWrap(handleUploadFront));
r.post("/back",  authenticate, upload, asyncWrap(handleUploadBack));
// GET /api/uploads/:key  (secured download)
r.get("/:key",   authenticate, asyncWrap(downloadImage));

export default r;