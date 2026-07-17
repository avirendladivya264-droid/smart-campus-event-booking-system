const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ============================
// REGISTER
// ============================
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      rollNumber,
      collegeName,
      department,
      year,
      phoneNumber,
      password,
    } = req.body;

    // Check required fields
    if (
      !fullName ||
      !email ||
      !rollNumber ||
      !collegeName ||
      !department ||
      !year ||
      !phoneNumber ||
      !password
    ) {
      return res.status(400).json({ msg: "All fields are required ❌" });
    }

    // Check if email exists
    const emailExists = await User.findOne({ email: email.trim() });
    if (emailExists) {
      return res.status(400).json({ msg: "Email already registered ❌" });
    }

    // Check if rollNumber exists
    const rollExists = await User.findOne({ rollNumber });
    if (rollExists) {
      return res.status(400).json({ msg: "Roll Number already registered ❌" });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      email: email.trim(),
      rollNumber,
      collegeName,
      department,
      year,
      phoneNumber,
      password: hashedPassword,
      role: "student",
    });

    await user.save();

    res.status(201).json({ msg: "Registered successfully ✅" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email.trim() });

    if (!user) return res.status(400).json({ msg: "User not found ❌" });

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials ❌" });
    }

    // Admin Secret Key Check
    if (
      user.role === "admin" ||
      user.role === "hod" ||
      user.role === "principal"
    ) {
      if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ msg: "Invalid Admin Key ❌" });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful ✅",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;