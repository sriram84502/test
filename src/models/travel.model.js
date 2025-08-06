import mongoose from "mongoose";

const travelSchema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    modeArrival:   String,
    flightNo:      String,
    arrivalAt:     Date,
    modeDeparture: String,
    vehicleNo:     String,
    departureAt:   Date,
  },
  { timestamps: true }
);

export default mongoose.model("Travel", travelSchema);