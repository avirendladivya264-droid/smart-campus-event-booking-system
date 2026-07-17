const Registration = require("../models/Registration");

const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ message: "Event ID required" });

    const reg = await Registration.create({ user: req.user._id, event: eventId });
    res.status(201).json({ message: "Registered successfully", registration: reg });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already registered" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const myRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user._id }).populate("event");
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const allRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find().populate("user").populate("event");
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerForEvent, myRegistrations, allRegistrations };
