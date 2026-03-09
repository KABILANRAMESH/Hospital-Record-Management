const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

/* =========================
   REGISTER PATIENT
========================= */
exports.registerPatient = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      age,
      gender,
      mobile,
      address,
      bloodGroup,
      height,
      weight,
    } = req.body;

    const exists = await Patient.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const patientId = `PAT${Date.now()}`;

    const patient = new Patient({
      patientId,
      fullName,
      email,
      password: hashedPassword,
      age,
      gender,
      mobile,
      address,
      bloodGroup,
      height,
      weight,
    });

    await patient.save();

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   LOGIN PATIENT
========================= */
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: patient._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      patient: {
        _id: patient._id,
        patientId: patient.patientId,
        fullName: patient.fullName,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        mobile: patient.mobile,
        address: patient.address,
        bloodGroup: patient.bloodGroup,
        height: patient.height,
        weight: patient.weight,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET PATIENT APPOINTMENTS (FAST)
========================= */
exports.getPatientAppointments = async (req, res) => {
  try {
    console.time("appointments-query");

    const appointments = await Appointment.find({
      patientId: req.user.id,
    })
.select("appointmentDate status visitTime doctorId")      .populate("doctorId", "name")               // 🔥 minimal populate
      .sort({ appointmentDate: -1 })              // 🔥 indexed field
      .limit(10);                                 // 🔥 pagination

    console.timeEnd("appointments-query");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

/* =========================
   GET MEDICAL HISTORY (FAST)
========================= */
exports.getMedicalHistory = async (req, res) => {
  try {
    console.time("medical-history");

    const appointments = await Appointment.find({
      patientId: req.user.id,
      status: { $in: ["approved", "completed"] },
    })
      .select(
        "appointmentDate doctorId medicalRecord report.fileName"
      ) // 🚀 DO NOT FETCH report.data
      .populate("doctorId", "name")
      .sort({ appointmentDate: -1 })
      .limit(20); // optional but recommended

    console.timeEnd("medical-history");

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch medical history" });
  }
};




/* =========================
   VIEW / DOWNLOAD REPORT
========================= */
exports.viewPatientReport = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .select("patientId report");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!appointment.report || !appointment.report.data) {
      return res.status(404).json({ message: "No report found" });
    }

    res.set({
      "Content-Type": appointment.report.fileType,
      "Content-Disposition": `inline; filename="${appointment.report.fileName}"`,
    });

    res.send(appointment.report.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to load report" });
  }
};
