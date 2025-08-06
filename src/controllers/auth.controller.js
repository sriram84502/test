import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import Preference from "../models/preference.model.js";
import Spouse from "../models/spouse.model.js";
import Travel from "../models/travel.model.js";

import AppError from "../errors/AppError.js";
import { asyncWrap } from "../middleware/asyncWrap.js";
import { signAccess, signRefresh, verifyRefresh } from "../utils/token.js";

dotenv.config();

// ────────────────────────────────────────────────────────────
// helpers
// ────────────────────────────────────────────────────────────
const issueTokens = (user) => {
  const payload = {
    sub: user.id,
    role: user.role,
    editableUntil: user.editableUntil,
  };
  return {
    access: signAccess(payload),
    refresh: signRefresh({ sub: user.id }),
  };
};

// ────────────────────────────────────────────────────────────
// controllers
// ────────────────────────────────────────────────────────────
export const registerStage1 = asyncWrap(async (req, res) => {
  const { username, email, password } = req.body;
  if (await User.exists({ $or: [{ username }, { email }] })) {
    throw new AppError("Username or email already taken", 409);
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({
    username,
    email,
    password: hash,
    editableUntil: Date.now() + process.env.EDIT_WINDOW_DAYS * 864e5,
  });

  const { access, refresh } = issueTokens(user);
  res
    .cookie("rt", refresh, { httpOnly: true, sameSite: "strict" })
    .json({ access });
});

export const registerStage2 = asyncWrap(async (req, res) => {
  const uid = req.user.sub;
  const { profile, preference, spouse, travel } = req.body;

  await Profile.updateOne({ userId: uid }, profile, { upsert: true });
  await Preference.updateOne({ userId: uid }, preference, { upsert: true });
  if (spouse) await Spouse.updateOne({ userId: uid }, spouse, { upsert: true });
  await Travel.updateOne({ userId: uid }, travel, { upsert: true });

  res.json({ message: "Registration complete" });
});

export const login = asyncWrap(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) throw new AppError("Invalid credentials", 401);

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const { access, refresh } = issueTokens(user);
  res
    .cookie("rt", refresh, { httpOnly: true, sameSite: "strict" })
    .json({ access });
});

export const refreshToken = asyncWrap(async (req, res) => {
  const token = req.cookies.rt;
  if (!token) throw new AppError("No refresh token", 401);

  const payload = verifyRefresh(token); // will throw if invalid/expired
  const user = await User.findById(payload.sub);
  if (!user) throw new AppError("User not found", 401);

  const { access, refresh } = issueTokens(user);
  res
    .cookie("rt", refresh, { httpOnly: true, sameSite: "strict" })
    .json({ access });
});

export const logout = asyncWrap(async (_req, res) => {
  res.clearCookie("rt").sendStatus(204);
});