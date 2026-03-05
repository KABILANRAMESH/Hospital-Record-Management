const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const doctorMiddleware = require("../middleware/doctorMiddleware");
const multer = require("multer");
const upload = multer({limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// controllers
const {getDoctorAppointments,updateAppointmentStatus,addMedicalRecord,uploadReport,viewReport,deleteReport,
} = require("../controllers/doctorController");

router.get(
  "/appointments",
  authMiddleware,
  doctorMiddleware,
  getDoctorAppointments
);

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


router.post(
  "/appointments/:id/report",
  authMiddleware,
  doctorMiddleware,
  upload.single("report"),
  uploadReport
);

router.get(
  "/appointments/:id/report",
  authMiddleware,
  doctorMiddleware,
  viewReport
);
router.delete(
  "/appointments/:id/report",
  authMiddleware,
  doctorMiddleware,
  deleteReport
);

module.exports = router;
