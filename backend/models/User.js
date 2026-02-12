const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    required: true
  },
  age: Number,
  gender: String,
  mobile: String,
  address: String,
  bloodGroup: String,
  height: Number,
  weight: Number
});

module.exports = mongoose.model("User", userSchema);
