const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    collegeName: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["student", "admin", "hod", "principal"],
      default: "student"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);