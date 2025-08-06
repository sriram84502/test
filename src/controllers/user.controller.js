import pdfkit from "pdfkit";
import path from "path";
import fs from "fs/promises";

import Profile from "../models/profile.model.js";
import Preference from "../models/preference.model.js";
import Spouse from "../models/spouse.model.js";
import Travel from "../models/travel.model.js";
import Assignment from "../models/assignment.model.js";

import { asyncWrap } from "../middleware/asyncWrap.js";
import AppError from "../errors/AppError.js";

// ────────────────────────────────────────────────────────────
export const getMe = asyncWrap(async (req, res) => {
  const uid = req.user.sub;

  const [profile, preference, spouse, travel, assignment] = await Promise.all([
    Profile.findOne({ userId: uid }),
    Preference.findOne({ userId: uid }),
    Spouse.findOne({ userId: uid }),
    Travel.findOne({ userId: uid }),
    Assignment.findOne({ userId: uid }),
  ]);

  res.json({ profile, preference, spouse, travel, assignment });
});

export const updateMe = asyncWrap(async (req, res) => {
  const uid = req.user.sub;
  const { profile, preference, spouse, travel } = req.body;

  if (profile) await Profile.updateOne({ userId: uid }, profile, { upsert: true });
  if (preference) await Preference.updateOne({ userId: uid }, preference, { upsert: true });
  if (spouse) await Spouse.updateOne({ userId: uid }, spouse, { upsert: true });
  if (travel) await Travel.updateOne({ userId: uid }, travel, { upsert: true });

  res.json({ message: "Updated" });
});

export const downloadBundle = asyncWrap(async (req, res) => {
  const uid = req.user.sub;

  const profile = await Profile.findOne({ userId: uid });
  if (!profile) throw new AppError("Profile not found", 404);

  const assignment = await Assignment.findOne({ userId: uid });

  // Build PDF
  const doc = new pdfkit();
  const tmp = path.join("/tmp", `bundle_${uid}.pdf`);
  const stream = doc.pipe(await fs.open(tmp, "w").then((f) => f.createWriteStream()));

  doc.fontSize(18).text("Registration Details", { underline: true }).moveDown();
  doc.fontSize(12).text(`Name: ${profile.fullName}`);
  doc.text(`State: ${profile.state}`);
  doc.text(`Designation: ${profile.designation}`).moveDown();

  if (assignment) {
    doc.text(`Room No: ${assignment.roomNo}`);
    doc.text(`Driver: ${assignment.driverName} (${assignment.driverPhone})`);
  }
  doc.end();

  stream.on("finish", async () => {
    res.download(tmp, "registration.pdf", () => fs.unlink(tmp));
  });
});