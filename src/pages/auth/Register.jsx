import { useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    mobile: "",
    address: "",
    bloodGroup: "",
    height: "",
    weight: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
     await api.post(
  "/api/patients/register",
  formData
);
      alert("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* LEFT INFO PANEL */}
      <div className="register-left">
        <h1>Smart Hospital</h1>
        <p>Register once to manage your medical records securely.</p>

        <ul>
          <li>✔ Secure patient data</li>
          <li>✔ Online appointments</li>
          <li>✔ Digital medical history</li>
        </ul>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="register-right">
        <h2>Patient Registration</h2>

        <form className="modern-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Mobile</label>
            <input name="mobile" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" onChange={handleChange} required>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select name="bloodGroup" onChange={handleChange} required>
              <option value="">Select</option>
              <option>O+</option><option>O-</option>
              <option>A+</option><option>A-</option>
              <option>B+</option><option>B-</option>
              <option>AB+</option><option>AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <input type="number" name="height" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input type="number" name="weight" onChange={handleChange} />
          </div>

          <div className="form-group full">
            <label>Address</label>
            <textarea rows="3" name="address" onChange={handleChange} required />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="login-link">
          Already registered?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
