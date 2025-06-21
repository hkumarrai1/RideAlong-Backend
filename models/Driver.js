const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicle: { type: String, required: true },
  availability: { type: Boolean, default: true },
  location: { type: Object, required: true },
});

module.exports = mongoose.model("Driver", DriverSchema);
