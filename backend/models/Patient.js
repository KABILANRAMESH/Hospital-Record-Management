const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: String, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: Number,
    gender: String,
    mobile: String,
    address: String,
    bloodGroup: String,
    height: Number,
    weight: Number,
  },
  { timestamps: true }
);

// ✅ THIS LINE IS VERY IMPORTANT
module.exports = mongoose.model("Patient", patientSchema);
