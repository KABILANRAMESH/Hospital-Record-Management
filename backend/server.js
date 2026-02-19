require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

// ✅ FIXED CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hospital-frontend-u08s.onrender.com"
    ],
    credentials: true,
  })
);

app.use(express.json());

// connect DB
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Backend running with MongoDB 🚀");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
