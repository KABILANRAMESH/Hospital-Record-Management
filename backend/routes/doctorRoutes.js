const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const doctorMiddleware = require("../middleware/doctorMiddleware");

const {
  getDoctorAppointments,
  updateAppointmentStatus,
    addMedicalRecord,
} = require("../controllers/doctorController");

// GET appointments
router.get(
  "/appointments",
  authMiddleware,
  doctorMiddleware,
  getDoctorAppointments
);

// ✅ PUT approve / reject
router.put(
  "/appointments/:id",
  authMiddleware,
  doctorMiddleware,
  updateAppointmentStatus
);
router.put(
  "/appointments/:id/medical-record",
  authMiddleware,
  doctorMiddleware,
  addMedicalRecord
);


module.exports = router;
