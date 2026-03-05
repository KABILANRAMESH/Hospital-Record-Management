const express = require("express");
const router = express.Router();

const {getAdminStats,addDoctor,getDoctors,getPatients,getPatientById,} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
router.get("/stats",authMiddleware,adminMiddleware,getAdminStats);
router.post("/add-doctor",authMiddleware,adminMiddleware,addDoctor);
router.get( "/doctors",authMiddleware,adminMiddleware,getDoctors);
router.get( "/patients",authMiddleware,adminMiddleware,getPatients);
router.get("/patients/:id", authMiddleware, adminMiddleware, getPatientById);

module.exports = router;
