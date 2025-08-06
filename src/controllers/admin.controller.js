import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Assignment from "../models/assignment.model.js";

import { asyncWrap } from "../middleware/asyncWrap.js";
import AppError from "../errors/AppError.js";

// ────────────────────────────────────────────────────────────
export const listUsers = asyncWrap(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const users = await User.find()
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .select("-password");
  res.json(users);
});

export const getUser = asyncWrap(async (req, res) => {
  const uid = req.params.id;
  const user = await User.findById(uid).select("-password");
  if (!user) throw new AppError("User not found", 404);

  const profile = await Profile.findOne({ userId: uid });
  res.json({ user, profile });
});

export const verifyUser = asyncWrap(async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { status: "VERIFIED" },
    { new: true }
  ).select("-password");

  if (!updated) throw new AppError("User not found", 404);
  res.json({ message: "Verified", user: updated });
});

export const assign = asyncWrap(async (req, res) => {
  const { roomNo, driverName, driverPhone } = req.body;

  const result = await Assignment.updateOne(
    { userId: req.params.id },
    { roomNo, driverName, driverPhone },
    { upsert: true }
  );

  if (!result) throw new AppError("User not found", 404);
  res.json({ message: "Assigned" });
});