const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { addReview, getReviews } = require("../controllers/reviewController");

router.get("/", getReviews);
router.post("/", protect, addReview);

module.exports = router;
