const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  registerPatient,
  loginPatient,
  getPatientAppointments,
  getMedicalHistory, // ✅ ADD THIS
} = require("../controllers/patientController");

const { bookAppointment } = require("../controllers/appointmentController");
const User = require("../models/User");

// AUTH
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// GET DOCTORS
router.get("/doctors", authMiddleware, async (req, res) => {
  const doctors = await User.find(
    { role: "doctor" },
    { name: 1, email: 1 }
  );
  res.json(doctors);
});

// BOOK APPOINTMENT
router.post("/appointments", authMiddleware, bookAppointment);

// GET PATIENT APPOINTMENTS
router.get("/appointments", authMiddleware, getPatientAppointments);

// ✅ GET PATIENT MEDICAL HISTORY
router.get(
  "/medical-history",
  authMiddleware,
  getMedicalHistory
);

module.exports = router;
