const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const patientMiddleware = require("../middleware/patientMiddleware");

const {
  registerPatient,
  loginPatient,
  getPatientAppointments,
  getMedicalHistory,
  viewPatientReport,
} = require("../controllers/patientController");

const { bookAppointment } = require("../controllers/appointmentController");
const User = require("../models/User");

/* =========================
   AUTH
========================= */
router.post("/register", registerPatient);
router.post("/login", loginPatient);

/* =========================
   DOCTORS LIST
========================= */
router.get(
  "/doctors",
  authMiddleware,
  patientMiddleware,
  async (req, res) => {
    const doctors = await User.find(
      { role: "doctor" },
      { name: 1, email: 1 }
    );
    res.json(doctors);
  }
);

/* =========================
   APPOINTMENTS
========================= */

// BOOK appointment
router.post(
  "/appointments",
  authMiddleware,
  patientMiddleware,
  bookAppointment
);

// GET patient appointments
router.get(
  "/appointments",
  authMiddleware,
  patientMiddleware,
  getPatientAppointments
);

/* =========================
   MEDICAL HISTORY
========================= */

// GET medical history
router.get(
  "/medical-history",
  authMiddleware,
  patientMiddleware,
  getMedicalHistory
);

// VIEW / DOWNLOAD REPORT
router.get(
  "/appointments/:id/report",
  authMiddleware,
  patientMiddleware,
  viewPatientReport
);

module.exports = router;
