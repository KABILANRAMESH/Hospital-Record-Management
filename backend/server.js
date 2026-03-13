require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// existing routes
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

// AI route
const aiRoutes = require("./routes/ai");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hospital-frontend-u08s.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// allow preflight requests
app.options("*", cors());

app.use(express.json());

// connect database
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Backend running with MongoDB 🚀");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);

// AI chatbot route
app.use("/api", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});