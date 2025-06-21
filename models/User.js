const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  role: { type: String, enum: ["Passenger", "Driver"] },
});

module.exports = mongoose.model("User", UserSchema);
