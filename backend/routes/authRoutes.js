const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");

// 🔐 REGISTER ROUTE (ADD THIS)
router.post("/register", register);

// 🔓 LOGIN ROUTE
router.post("/login", login);

module.exports = router;
