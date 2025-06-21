const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/profile-status", async (req, res) => {
  try {
    const { firebaseUID } = req.query;
    console.log("[profile-status] firebaseUID:", firebaseUID);
    if (!firebaseUID) {
      console.log("[profile-status] Missing firebaseUID");
      return res.status(400).json({ error: "firebaseUID is required" });
    }
    const user = await User.findOne({ firebaseUID });
    console.log("[profile-status] User found:", user);
    if (!user) {
      console.log("[profile-status] User not found");
      return res.status(404).json({ error: "User not found" });
    }
    // Define required fields for profile completion
    const requiredFields = ["name", "email", "phone", "role"];
    const profileComplete = requiredFields.every(
      (field) => user[field] && user[field].toString().trim() !== ""
    );
    console.log("[profile-status] profileComplete:", profileComplete);
    res.json({ profileComplete, user });
  } catch (err) {
    console.log("[profile-status] Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const { firebaseUID, name, phone, role } = req.body;
    console.log("[profile PUT] body:", req.body);
    if (!firebaseUID) {
      console.log("[profile PUT] Missing firebaseUID");
      return res.status(400).json({ error: "firebaseUID is required" });
    }
    const user = await User.findOneAndUpdate(
      { firebaseUID },
      { $set: { name, phone, role } },
      { new: true }
    );
    console.log("[profile PUT] Updated user:", user);
    if (!user) {
      console.log("[profile PUT] User not found");
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.log("[profile PUT] Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Route to create a user with firebaseUID and email at signup
router.post("/register", async (req, res) => {
  try {
    const { firebaseUID, email } = req.body;
    if (!firebaseUID || !email) {
      return res
        .status(400)
        .json({ error: "firebaseUID and email are required" });
    }
    // Check if user already exists
    let user = await User.findOne({ firebaseUID });
    if (user) {
      return res.status(200).json({ message: "User already exists", user });
    }
    user = await User.create({ firebaseUID, email });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;
