const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { registerForEvent, myRegistrations, allRegistrations } = require("../controllers/registrationController");

router.post("/", protect, registerForEvent);
router.get("/me", protect, myRegistrations);
router.get("/all", protect, adminOnly, allRegistrations);

module.exports = router;
