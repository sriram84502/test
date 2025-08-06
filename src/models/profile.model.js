import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    state:        String,
    designation:  String,
    title:        String,
    fullName:     String,
    idType:       String,
    phone:        String,
    emailId:      String,
    frontImageKey:String,
    backImageKey: String,
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);