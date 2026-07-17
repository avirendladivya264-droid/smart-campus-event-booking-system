require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

(async () => {
  await connectDB(process.env.MONGO_URI);

  const email = "admin@campus.com";
  const rollNumber = "ADMIN001";

  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashed = await bcrypt.hash("Admin@123", 10);

  await User.create({
    fullName: "Campus Admin",
    email,
    rollNumber,
    collegeName: "Campus College",
    department: "Administration",
    year: "N/A",
    phoneNumber: "9999999999",
    password: hashed,
    role: "admin"
  });

  console.log("Admin created: admin@campus.com / Admin@123");
  process.exit(0);
})();
