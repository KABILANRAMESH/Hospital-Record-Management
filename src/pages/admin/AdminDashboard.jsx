import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ===== STATES =====
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAdmins: 0,
  });

  const [doctors, setDoctors] = useState([]);

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ===== AUTH CHECK + INITIAL LOAD =====
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchStats();
    fetchDoctors();
  }, [navigate, user]);

  // ===== FETCH STATS =====
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to load stats");
    }
  };

  // ===== FETCH DOCTORS LIST =====
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/admin/doctors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDoctors(res.data);
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to load doctors");
    }
  };

  // ===== FORM HANDLERS =====
  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/admin/add-doctor",
        doctorForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Doctor added successfully");

      setDoctorForm({ name: "", email: "", password: "" });

      // refresh data
      fetchStats();
      fetchDoctors();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add doctor");
    }
  };

  // ===== UI =====
  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.name}</p>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="cards">
        <div className="card blue">
          <h3>Total Patients</h3>
          <p>{stats.totalPatients}</p>
        </div>

        <div className="card green">
          <h3>Total Doctors</h3>
          <p>{stats.totalDoctors}</p>
        </div>

        <div className="card purple">
          <h3>Total Admins</h3>
          <p>{stats.totalAdmins}</p>
        </div>
      </div>

      {/* DOCTORS LIST */}
      <div className="doctors-section">
        <h3>Doctors List</h3>

        {doctors.length === 0 ? (
          <p>No doctors found</p>
        ) : (
          <table className="doctors-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD DOCTOR */}
      <div className="add-doctor-section">
        <h3>Add Doctor</h3>

        <form onSubmit={handleAddDoctor} className="add-doctor-form">
          <input
            name="name"
            placeholder="Doctor Name"
            value={doctorForm.name}
            onChange={handleDoctorChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Doctor Email"
            value={doctorForm.email}
            onChange={handleDoctorChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={doctorForm.password}
            onChange={handleDoctorChange}
            required
          />

          <button type="submit">Add Doctor</button>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboard;
