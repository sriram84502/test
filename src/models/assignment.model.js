import mongoose from "mongoose";

const assignSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    roomNo:      String,
    driverName:  String,
    driverPhone: String,
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignSchema);