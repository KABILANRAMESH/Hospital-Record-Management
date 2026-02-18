const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const doctorMiddleware = require("../middleware/doctorMiddleware");

const multer = require("multer");
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// controllers
const {
  getDoctorAppointments,
  updateAppointmentStatus,
  addMedicalRecord,
  uploadReport,
  viewReport,
  deleteReport,
} = require("../controllers/doctorController");

/* =========================
   APPOINTMENTS
========================= */

// GET all doctor appointments
router.get(
  "/appointments",
  authMiddleware,
  doctorMiddleware,
  getDoctorAppointments
);

// APPROVE / REJECT appointment
router.put(
  "/appointments/:id",
  authMiddleware,
  doctorMiddleware,
  updateAppointmentStatus
);

// ADD / UPDATE medical record
router.put(
  "/appointments/:id/medical-record",
  authMiddleware,
  doctorMiddleware,
  addMedicalRecord
);

/* =========================
   REPORT MANAGEMENT
========================= */

// UPLOAD report
router.post(
  "/appointments/:id/report",
  authMiddleware,
  doctorMiddleware,
  upload.single("report"),
  uploadReport
);

// VIEW report (PDF / Image opens in browser)
router.get(
  "/appointments/:id/report",
  authMiddleware,
  doctorMiddleware,
  viewReport
);

// DELETE report
router.delete(
  "/appointments/:id/report",
  authMiddleware,
  doctorMiddleware,
  deleteReport
);

module.exports = router;
