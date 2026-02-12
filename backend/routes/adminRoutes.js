const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  addDoctor,
  getDoctors,          // 👈 ADD THIS
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getAdminStats
);

router.post(
  "/add-doctor",
  authMiddleware,
  adminMiddleware,
  addDoctor
);

// ✅ NEW ROUTE TO GET DOCTORS LIST
router.get(
  "/doctors",
  authMiddleware,
  adminMiddleware,
  getDoctors
);

module.exports = router;
