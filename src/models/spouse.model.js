import mongoose from "mongoose";

const spouseSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    title:     String,
    fullName:  String,
    idType:    String,
    phone:     String,
    emailId:   String,
    frontImageKey:String,
    backImageKey:String,
  },
  { timestamps: true }
);

export default mongoose.model("Spouse", spouseSchema);