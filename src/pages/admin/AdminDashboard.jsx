import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.role !== "admin") {
      navigate("/");
      return;
    }

    setUser(storedUser);
    fetchStats();
    fetchDoctors();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStats(res.data);
  };

  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/admin/doctors", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDoctors(res.data);
  };

  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await api.post(
      "/api/admin/add-doctor",
      doctorForm,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setDoctorForm({ name: "", email: "", password: "" });
    fetchStats();
    fetchDoctors();
  };

  if (!user) return null;

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1 className="logo">
          Admin <br />
          <span>Dashboard</span>
        </h1>

        <p className="online">🟢 {user.name} — Online</p>

        <div className="stat-card">
          <h2>{stats.totalPatients}</h2>
          <p>Total Patients</p>
        </div>

        <div className="stat-card amber">
          <h2>{stats.totalDoctors}</h2>
          <p>Total Doctors</p>
        </div>

        <div className="stat-card indigo">
          <h2>{stats.totalAdmins}</h2>
          <p>Total Admins</p>
        </div>

        <button
          className="logout"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <input className="search" placeholder="Search doctors, emails..." />
        </header>

        <section>
          <h3 className="section-title">Doctors List</h3>

          {doctors.map((doc) => (
            <div className="list-card" key={doc._id}>
              <h4>{doc.name}</h4>
              <p>{doc.email}</p>
            </div>
          ))}
        </section>

        <section className="form-section">
          <h3 className="section-title">Add Doctor</h3>

          <form onSubmit={handleAddDoctor}>
            <input
              name="name"
              placeholder="Doctor Name"
              value={doctorForm.name}
              onChange={handleDoctorChange}
            />
            <input
              name="email"
              placeholder="Doctor Email"
              value={doctorForm.email}
              onChange={handleDoctorChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={doctorForm.password}
              onChange={handleDoctorChange}
            />
            <button>Add Doctor</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
