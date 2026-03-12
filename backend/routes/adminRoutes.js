const express = require("express");
const router = express.Router();

const {getAdminStats,addDoctor,getDoctors,getPatients,getPatientById,getDoctorById,updateDoctor,updatePatient} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
router.get("/stats",authMiddleware,adminMiddleware,getAdminStats);
router.post("/add-doctor",authMiddleware,adminMiddleware,addDoctor);
router.get("/doctors",authMiddleware,adminMiddleware,getDoctors);
router.get("/doctors/:id",authMiddleware,adminMiddleware,getDoctorById);
router.put("/doctors/:id",authMiddleware,adminMiddleware,updateDoctor);
router.get("/patients",authMiddleware,adminMiddleware,getPatients);
router.get("/patients/:id", authMiddleware, adminMiddleware, getPatientById);
router.put("/patients/:id", authMiddleware, adminMiddleware, updatePatient);

module.exports = router;
