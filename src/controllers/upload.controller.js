import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs/promises";

import Profile from "../models/profile.model.js";
import AppError from "../errors/AppError.js";
import { asyncWrap } from "../middleware/asyncWrap.js";   // ← add this line

/* ------------ Multer config ------------------------------------ */
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_, file, cb) => cb(null, uuid() + path.extname(file.originalname)),
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },          // 2 MB
  fileFilter: (_, file, cb) => {
    const ok = ["image/png", "image/jpeg"].includes(file.mimetype);
    cb(ok ? null : new AppError("Only PNG and JPEG allowed", 415));
  },
}).single("file");

/* ------------ Upload handlers ---------------------------------- */
export const handleUploadFront = asyncWrap(async (req, res) => {
  if (!req.file) throw new AppError("No file received", 400);

  await Profile.updateOne(
    { userId: req.user.sub },
    { frontImageKey: req.file.filename },
    { upsert: true }
  );
  res.json({ key: req.file.filename });
});

export const handleUploadBack = asyncWrap(async (req, res) => {
  if (!req.file) throw new AppError("No file received", 400);

  await Profile.updateOne(
    { userId: req.user.sub },
    { backImageKey: req.file.filename },
    { upsert: true }
  );
  res.json({ key: req.file.filename });
});

/* ------------ Secure download ---------------------------------- */
export const downloadImage = asyncWrap(async (req, res) => {
  const key = req.params.key;                               // uuid.jpg
  const profile = await Profile.findOne({ userId: req.user.sub });
  if (!profile) throw new AppError("Profile not found", 404);

  const allowed =
    key === profile.frontImageKey ||
    key === profile.backImageKey ||
    req.user.role === "admin";

  if (!allowed) throw new AppError("Forbidden", 403);

  const filePath = path.resolve("uploads", key);
  try {
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch {
    throw new AppError("File not found", 404);
  }
});