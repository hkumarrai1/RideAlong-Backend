const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    vehicleType: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    status: {
      type: String,
      enum: ["available", "not_available"],
      default: "available",
    },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    timestamp: { type: Date, default: Date.now }, // When the ride request was created
  },
  { timestamps: true }
);

rideSchema.index({ location: "2dsphere" });

const Ride = mongoose.model("Ride", rideSchema);
module.exports = Ride;
