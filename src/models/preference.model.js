import mongoose from "mongoose";

const prefSchema = new mongoose.Schema(
  {
    userId:               { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    wantsBalaji:          Boolean,
    wantsSrikalahasti:    Boolean,
    spouseWillAttend:     Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Preference", prefSchema);