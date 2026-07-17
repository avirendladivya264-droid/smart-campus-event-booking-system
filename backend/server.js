const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// =======================
// USER SCHEMA
// =======================
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

// =======================
// EVENT SCHEMA
// =======================
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: String,
  date: String,
  time: String,
  imageUrl: String,
  createdBy: String,

  isPublished: { type: Boolean, default: false },

  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
});
const Event = mongoose.model("Event", eventSchema);

// =======================
// REVIEW SCHEMA
// =======================
const reviewSchema = new mongoose.Schema({
  name: String,
  message: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now },
});
const Review = mongoose.model("Review", reviewSchema);

// =======================
// REGISTRATION SCHEMA
// =======================
const registrationSchema = new mongoose.Schema({
  userId: String,
  eventId: String,
  paymentStatus: { type: String, default: "UNPAID" }, // PAID / UNPAID
  createdAt: { type: Date, default: Date.now },
});
const Registration = mongoose.model("Registration", registrationSchema);

// =======================
// REGISTER
// =======================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password required" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    let role = "student";
    if (adminKey === "campus@123") role = "admin";

    const newUser = new User({
      email: email.toLowerCase().trim(),
      password,
      role,
    });

    await newUser.save();
    res.json({ msg: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Register error" });
  }
});

// =======================
// LOGIN
// =======================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, adminKey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    if (user.role === "admin" && adminKey !== "campus@123") {
      return res.status(400).json({ msg: "Invalid admin key" });
    }

    res.json({ msg: "Login success", token: "dummy-token", user });
  } catch (err) {
    res.status(500).json({ msg: "Login error" });
  }
});

// =======================
// CREATE EVENT (ADMIN)
// =======================
app.post("/api/events", async (req, res) => {
  try {
    const event = new Event({ ...req.body, isPublished: false });
    await event.save();
    res.json({ msg: "Event created successfully", event });
  } catch (err) {
    res.status(500).json({ msg: "Error creating event" });
  }
});

// =======================
// GET ALL EVENTS (ADMIN)
// =======================
app.get("/api/events/all", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching events" });
  }
});

// =======================
// GET UPCOMING EVENTS (HOME)
// =======================
app.get("/api/events/upcoming", async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true })
      .sort({ date: 1 })
      .limit(6);

    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching upcoming events" });
  }
});

// =======================
// GET PUBLISHED EVENTS
// =======================
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching events" });
  }
});

// =======================
// PUBLISH / UNPUBLISH EVENT (TOGGLE)
// =======================
app.patch("/api/events/:id/publish", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    event.isPublished = !event.isPublished;
    await event.save();

    res.json({
      msg: event.isPublished ? "Event Published" : "Event Unpublished",
      event,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error publishing event" });
  }
});

// =======================
// DELETE EVENT (ADMIN)
// =======================
app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting event" });
  }
});

// =======================
// STUDENT REGISTER FREE EVENT
// =======================
app.post("/api/events/:id/register", async (req, res) => {
  try {
    const { userId } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const existing = await Registration.findOne({
      userId,
      eventId: req.params.id,
    });
    app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching event" });
  }
});

    if (existing) return res.json({ msg: "Already registered ✅" });

    if (event.isPaid) {
      return res.status(400).json({ msg: "This is a paid event. Please pay first ❌" });
    }

    const reg = new Registration({
      userId,
      eventId: req.params.id,
      paymentStatus: "PAID",
    });

    await reg.save();

    res.json({ msg: "Registered Successfully ✅", reg });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed ❌" });
  }
});

// =======================
// FAKE PAYMENT + REGISTER PAID EVENT
// =======================
app.post("/api/events/:id/pay", async (req, res) => {
  try {
    const { userId } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (!event.isPaid) {
      return res.status(400).json({ msg: "This event is free. No payment required." });
    }

    const existing = await Registration.findOne({
      userId,
      eventId: req.params.id,
    });

    if (existing) return res.json({ msg: "Already registered ✅" });

    const reg = new Registration({
      userId,
      eventId: req.params.id,
      paymentStatus: "PAID",
    });

    await reg.save();

    res.json({ msg: "Payment Successful & Registered ✅", reg });
  } catch (err) {
    res.status(500).json({ msg: "Payment failed ❌" });
  }
});

// =======================
// GET REVIEWS
// =======================
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching reviews" });
  }
});

// =======================
// POST REVIEW
// =======================
app.post("/api/reviews", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.json({ msg: "Review added", review });
  } catch (err) {
    res.status(500).json({ msg: "Error saving review" });
  }
});

// =======================
// START SERVER
// =======================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});