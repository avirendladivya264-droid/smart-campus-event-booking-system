const Event = require("../models/Event");
const Registration = require("../models/Registration");

const createEvent = async (req, res) => {
  try {
    const { title, description, category, location, date, time, imageUrl } = req.body;

    if (!title || !description || !category || !location || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.create({
      title, description, category, location, date, time,
      imageUrl: imageUrl || "",
      createdBy: req.user._id
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const { search, category, date, sort } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (date) {
      query.date = date;
    }

    let events = await Event.find(query).sort({ createdAt: -1 });

    // sort by soonest
    if (sort === "soonest") {
      events = events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    }

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentTime = now.toTimeString().slice(0, 5);

    const events = await Event.find({
      $or: [
        { date: { $gt: today } },
        { date: today, time: { $gte: currentTime } }
      ]
    });

    const sorted = events.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const count = await Registration.countDocuments({ event: event._id });

    res.json({ ...event.toObject(), registrations: count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    await Registration.deleteMany({ event: req.params.id });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createEvent, getEvents, getUpcomingEvents, getEventById, updateEvent, deleteEvent };
