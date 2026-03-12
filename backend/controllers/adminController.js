const User = require("../models/User");
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");

// GET ADMIN STATS
exports.getAdminStats = async (req, res) => {
  try {
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalPatients = await Patient.countDocuments();

    res.json({
      totalDoctors,
      totalAdmins,
      totalPatients,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// ✅ ADD DOCTOR (THIS WAS MISSING)
exports.addDoctor = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    // check if doctor already exists
    const existingDoctor = await User.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create doctor
    const doctor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      mobile: mobile || "",
    });

    res.status(201).json({
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add doctor" });
  }
};
// GET ALL DOCTORS (name + email + mobile)
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find(
      { role: "doctor" },
      { name: 1, email: 1, mobile: 1 } // include mobile field
    );

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};

// GET DOCTOR BY ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne(
      { _id: req.params.id, role: "doctor" },
      { name: 1, email: 1, mobile: 1 }
    );

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctor" });
  }
};

// GET ALL PATIENTS WITH THEIR LATEST DOCTOR (if any)
exports.getPatients = async (req, res) => {
  try {
    // fetch all patients
    const patients = await Patient.find().lean();

    // load latest appointment for each patient to figure out attending doctor
    const appointments = await require("../models/Appointment")
      .find({ patientId: { $in: patients.map(p => p._id) } })
      .sort({ appointmentDate: -1 })
      .populate("doctorId", "name");

    const map = {};
    appointments.forEach((a) => {
      if (!map[a.patientId]) {
        map[a.patientId] = a.doctorId ? a.doctorId.name : null;
      }
    });

    const result = patients.map((p) => ({
      _id: p._id,
      fullName: p.fullName,
      email: p.email,
      doctor: map[p._id] || null,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch patients" });
  }
};

// GET PATIENT BY ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patient" });
  }
};

// UPDATE DOCTOR
exports.updateDoctor = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const doctorId = req.params.id;

    const updateData = { name, email, mobile };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedDoctor = await User.findByIdAndUpdate(
      doctorId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update doctor" });
  }
};

// UPDATE PATIENT
exports.updatePatient = async (req, res) => {
  try {
    const { fullName, email, age, gender, mobile, address, bloodGroup, height, weight, password } = req.body;
    const patientId = req.params.id;

    const updateData = { fullName, email, age, gender, mobile, address, bloodGroup, height, weight };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update patient" });
  }
};
