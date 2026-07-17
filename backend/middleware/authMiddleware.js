const jwt = require("jsonwebtoken");
const User = require("../models/User");

// AUTH CHECK
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token found" });
  }

  try {
    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// ADMIN CHECK
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied (Admin only)" });
  }
  next();
};

module.exports = { protect, adminOnly };