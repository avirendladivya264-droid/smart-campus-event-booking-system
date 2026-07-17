const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) return res.status(400).json({ message: "Rating and comment required" });

    const review = await Review.create({
      user: req.user._id,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getReviews = async (req, res) => {
  try {
    const { sort } = req.query;
    let query = Review.find().populate("user", "fullName rollNumber department");

    if (sort === "highest") query = query.sort({ rating: -1 });
    else query = query.sort({ createdAt: -1 });

    const reviews = await query;
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addReview, getReviews };
