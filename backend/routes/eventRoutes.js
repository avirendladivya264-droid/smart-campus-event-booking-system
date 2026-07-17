const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// ==========================
// CREATE EVENT (ADMIN)
// ==========================
router.post("/create", async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      date: req.body.date,
      time: req.body.time,
      imageUrl: req.body.imageUrl || "",
      isPublished: false, // default unpublished
    });

    await event.save();

    res.status(201).json({
      msg: "Event Created Successfully ✅",
      event,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ==========================
// GET UPCOMING EVENTS (HOME)
// ==========================
router.get("/upcoming", async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true })
      .sort({ date: 1 })
      .limit(6);

    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ==========================
// GET ALL PUBLISHED EVENTS
// ==========================
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ==========================
// GET ALL EVENTS (ADMIN)
// ==========================
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ==========================
// PUBLISH EVENT (ADMIN)
// ==========================
router.put("/publish/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isPublished: true },
      { new: true }
    );

    res.json({ msg: "Event Published ✅", event });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ==========================
// UNPUBLISH EVENT (ADMIN)
// ==========================
router.put("/unpublish/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true }
    );

    res.json({ msg: "Event Unpublished ❌", event });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ==========================
// DELETE EVENT (ADMIN)
// ==========================
router.delete("/delete/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event Deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;