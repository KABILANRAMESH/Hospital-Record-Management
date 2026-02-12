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
    const { name, email, password } = req.body;

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
    });

    res.status(201).json({
      message: "Doctor added successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add doctor" });
  }
};
// GET ALL DOCTORS (name + email)
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find(
      { role: "doctor" },
      { name: 1, email: 1 } // only send required fields
    );

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
};
