const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment"); // ✅ KEEP ONLY THIS

const bcrypt = require("bcryptjs");

// REGISTER PATIENT
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

// LOGIN PATIENT
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

    // 🔑 CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: patient._id,
        role: "patient",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token, // ✅ IMPORTANT
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


exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
    })
      .populate("doctorId", "name email")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// GET patient medical history
exports.getMedicalHistory = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
      status: "approved",
      medicalRecord: { $exists: true },
    })
      .populate("doctorId", "name email")
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch medical history" });
  }
};


