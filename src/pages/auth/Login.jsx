import { useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let response;

    if (role === "patient") {
  response = await api.post(
  "/api/patients/login",
  { email, password }
);

  // ✅ SAVE TOKEN (THIS WAS MISSING)
  localStorage.setItem("token", response.data.token);

  // save patient info
  localStorage.setItem(
    "patient",
    JSON.stringify(response.data.patient)
  );

  navigate("/patient/dashboard");
}
else {
response = await api.post(
  "/api/auth/login",
  { email, password, role }
);

// 🔥 THIS WAS MISSING
localStorage.setItem("token", response.data.token);

localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

if (response.data.user.role === "admin") {
  navigate("/admin/dashboard");
} else {
  navigate("/doctor/dashboard");
}

      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="app-title">Smart Hospital</h1>
        <p className="subtitle">Secure login portal</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Login As</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="patient">Patient</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
          <p className="register-link">
  New patient?{" "}
  <span onClick={() => navigate("/register")}>
    Register here
  </span>
</p>

        </form>

        <p className="footer-text">© 2026 Smart Hospital System</p>
      </div>
    </div>
  );
}

export default Login;
