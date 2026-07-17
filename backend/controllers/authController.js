const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, rollNumber, collegeName, department, year, phoneNumber, password } = req.body;

    if (!fullName || !email || !rollNumber || !collegeName || !department || !year || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existsEmail = await User.findOne({ email });
    if (existsEmail) return res.status(400).json({ message: "Email already exists" });

    const existsRoll = await User.findOne({ rollNumber });
    if (existsRoll) return res.status(400).json({ message: "Roll number already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName, email, rollNumber, collegeName, department, year, phoneNumber,
      password: hashed,
      role: "student"
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or rollNumber

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { rollNumber: identifier }]
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    return res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        rollNumber: user.rollNumber,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
