import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("doctors");

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAdmins: 0,
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editDoctorMode, setEditDoctorMode] = useState(false);
  const [editDoctorForm, setEditDoctorForm] = useState({});
  const [loadingDoctorAdd, setLoadingDoctorAdd] = useState(false);
  const [loadingDoctorEdit, setLoadingDoctorEdit] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [editPatientMode, setEditPatientMode] = useState(false);
  const [editPatientForm, setEditPatientForm] = useState({});
  const [loadingPatientEdit, setLoadingPatientEdit] = useState(false);

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

  // refetch patients whenever admin switches to patients view
  useEffect(() => {
    if (activeSection === "patients") fetchPatients();
  }, [activeSection]);

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

  const handleDoctorClick = async (doctor) => {
    setSelectedDoctor(doctor);
    const token = localStorage.getItem("token");
    try {
      const res = await api.get(`/api/admin/doctors/${doctor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorDetails(res.data);
      setShowDoctorModal(true);
    } catch (error) {
      console.error("Failed to fetch doctor details", error);
    }
  };

  const fetchPatients = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/admin/patients", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPatients(res.data);
  };

  const handleDoctorChange = (e) => {
    setDoctorForm({ ...doctorForm, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setLoadingDoctorAdd(true);
    const token = localStorage.getItem("token");
    try {
      await api.post("/api/admin/add-doctor", doctorForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorForm({ name: "", email: "", password: "", mobile: "" });
      fetchStats();
      fetchDoctors();
      alert("Doctor added successfully!");
    } catch (error) {
      alert("Failed to add doctor");
    } finally {
      setLoadingDoctorAdd(false);
    }
  };

  const handleDoctorEdit = () => {
    setEditDoctorMode(true);
    setEditDoctorForm({
      name: doctorDetails.name,
      email: doctorDetails.email,
      mobile: doctorDetails.mobile || "",
      password: "",
    });
  };

  const handleDoctorEditChange = (e) => {
    setEditDoctorForm({ ...editDoctorForm, [e.target.name]: e.target.value });
  };

  const handleSaveDoctorEdit = async (e) => {
    e.preventDefault();
    setLoadingDoctorEdit(true);
    const token = localStorage.getItem("token");
    try {
      await api.put(`/api/admin/doctors/${doctorDetails._id}`, editDoctorForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditDoctorMode(false);
      fetchDoctors();
      // Refresh doctor details
      const res = await api.get(`/api/admin/doctors/${doctorDetails._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctorDetails(res.data);
      alert("Doctor updated successfully!");
    } catch (error) {
      alert("Failed to update doctor");
    } finally {
      setLoadingDoctorEdit(false);
    }
  };

  const handlePatientEdit = () => {
    setEditPatientMode(true);
    setEditPatientForm({
      fullName: patientDetails.fullName,
      email: patientDetails.email,
      age: patientDetails.age || "",
      gender: patientDetails.gender || "",
      mobile: patientDetails.mobile || "",
      address: patientDetails.address || "",
      bloodGroup: patientDetails.bloodGroup || "",
      height: patientDetails.height || "",
      weight: patientDetails.weight || "",
      password: "",
    });
  };

  const handlePatientEditChange = (e) => {
    setEditPatientForm({ ...editPatientForm, [e.target.name]: e.target.value });
  };

  const handleSavePatientEdit = async (e) => {
    e.preventDefault();
    setLoadingPatientEdit(true);
    const token = localStorage.getItem("token");
    try {
      await api.put(`/api/admin/patients/${patientDetails._id}`, editPatientForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditPatientMode(false);
      fetchPatients();
      // Refresh patient details
      const res = await api.get(`/api/admin/patients/${patientDetails._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientDetails(res.data);
      alert("Patient updated successfully!");
    } catch (error) {
      alert("Failed to update patient");
    } finally {
      setLoadingPatientEdit(false);
    }
  };

  const getInitials = (name = "D") =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatients = patients.filter(
    (p) =>
      p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.doctor || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadPatientsCsv = () => {
    if (filteredPatients.length === 0) return;
    const rows = [["Name","Email","Doctor"]];
    filteredPatients.forEach((p) => {
      rows.push([
        p.fullName || "",
        p.email || "",
        p.doctor || "",
      ]);
    });
    const csvContent = rows
      .map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patients.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePatientClick = async (patient) => {
    setSelectedPatient(patient);
    const token = localStorage.getItem("token");
    try {
      const res = await api.get(`/api/admin/patients/${patient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatientDetails(res.data);
      setShowPatientModal(true);
    } catch (error) {
      console.error("Failed to fetch patient details", error);
    }
  };


  if (!user) return null;

  const adminName = user.fullName || user.name || "Admin";

  return (
    <div className="layout">

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className="sidebar">

        <div className="adm-brand">
          <div className="adm-brand-icon">🛡️</div>
          <span className="adm-brand-name">HealthSync</span>
        </div>

        {/* Nav */}
        <div
          className={`adm-nav-item ${activeSection === "doctors" ? "active" : ""}`}
          onClick={() => setActiveSection("doctors")}
          style={{ cursor: "pointer" }}
        >
          <span className="adm-nav-icon">👥</span>
          Doctors
        </div>
        <div
          className={`adm-nav-item ${activeSection === "patients" ? "active" : ""}`}
          onClick={() => setActiveSection("patients")}
          style={{ cursor: "pointer" }}
        >
          <span className="adm-nav-icon">🧑‍🤝‍🧑</span>
          Patients
        </div>

        <div className="adm-divider" />

        <div className="adm-nav-label">Overview</div>

        <div className="adm-stat-row">
          <div className="adm-stat-pill">
            <span className="adm-stat-pill-label">🧑‍⚕️ Patients</span>
            <span className="adm-stat-pill-value">{stats.totalPatients}</span>
          </div>
          <div className="adm-stat-pill">
            <span className="adm-stat-pill-label">👨‍⚕️ Doctors</span>
            <span className="adm-stat-pill-value">{stats.totalDoctors}</span>
          </div>
          <div className="adm-stat-pill">
            <span className="adm-stat-pill-label">🔐 Admins</span>
            <span className="adm-stat-pill-value">{stats.totalAdmins}</span>
          </div>
        </div>

        <div className="adm-divider" />

        <div className="adm-nav-label">Actions</div>

        <div
          className="adm-logout-item"
          onClick={() => { localStorage.clear(); navigate("/"); }}
        >
          <span className="adm-nav-icon">🚪</span>
          Logout
        </div>

        <div className="adm-user-card">
          <div className="adm-avatar">{getInitials(adminName)}</div>
          <div className="adm-user-info">
            <div className="adm-user-name">{adminName}</div>
            <div className="adm-user-role">
              <span className="adm-online-dot" />
              Admin · Online
            </div>
          </div>
        </div>

      </aside>

      {/* ══════════════ MAIN ══════════════ */}
      <main className="main">

        {/* Hero banner */}
        <div className="adm-hero">
          <div className="adm-hero-title">Admin Dashboard</div>
          <div className="adm-hero-sub">
            {stats.totalDoctors} doctors · {stats.totalPatients} patients · {stats.totalAdmins} admins
          </div>

          <div className="adm-hero-controls">
            <div className="adm-search-wrap">
              <span className="adm-search-icon">🔍</span>
              <input
                className="adm-search"
                placeholder={
                  activeSection === "doctors"
                    ? "Search doctors or emails..."
                    : "Search patients, emails or doctor..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="adm-content">

          {activeSection === "doctors" && (
            <>
              {/* ── Doctors List ── */}
              <section>
                <div className="adm-section-head">
                  <div className="adm-section-title">Doctors List</div>
                  <span className="adm-section-count">{filteredDoctors.length} doctors</span>
                </div>

                <div className="adm-doctors-grid">
                  {filteredDoctors.map((doc, i) => (
                    <div
                      className="adm-doctor-card"
                      key={doc._id}
                      style={{ animationDelay: `${i * 0.04}s`, cursor: "pointer" }}
                      onClick={() => handleDoctorClick(doc)}
                    >
                      <div className="adm-doctor-avatar">{getInitials(doc.name)}</div>
                      <div className="adm-doctor-info">
                        <div className="adm-doctor-name">{doc.name}</div>
                        <div className="adm-doctor-email">{doc.email}</div>
                      </div>
                      <span className="adm-doctor-badge">Doctor</span>
                    </div>
                  ))}

                  {filteredDoctors.length === 0 && (
                    <div style={{ color: "#9ca3af", fontSize: 13, padding: "16px 4px" }}>
                      No doctors found.
                    </div>
                  )}
                </div>
              </section>

              {/* ── Add Doctor ── */}
              <section>
                <div className="adm-section-head">
                  <div className="adm-section-title">Add Doctor</div>
                </div>

                <div className="adm-form-card">
                  <form onSubmit={handleAddDoctor} className="adm-form-grid">

                    <div className="adm-field">
                      <label>Doctor Name</label>
                      <input
                        className="adm-input"
                        name="name"
                        placeholder="Full name"
                        value={doctorForm.name}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>

                    <div className="adm-field">
                      <label>Email Address</label>
                      <input
                        className="adm-input"
                        name="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={doctorForm.email}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>

                    <div className="adm-field">
                      <label>Password</label>
                      <input
                        className="adm-input"
                        name="password"
                        type="password"
                        placeholder="Set a password"
                        value={doctorForm.password}
                        onChange={handleDoctorChange}
                        required
                      />
                    </div>

                    <div className="adm-field">
                      <label>Phone Number</label>
                      <input
                        className="adm-input"
                        name="mobile"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={doctorForm.mobile}
                        onChange={handleDoctorChange}
                      />
                    </div>

                    <button className="adm-submit-btn" type="submit" disabled={loadingDoctorAdd}>
                      {loadingDoctorAdd ? "Adding Doctor..." : "+ Add Doctor"}
                    </button>

                  </form>
                </div>
              </section>
            </>
          )}

          {activeSection === "patients" && (
            <section>
              <div className="adm-section-head">
                <div className="adm-section-title">Patients List</div>
                <span className="adm-section-count">{filteredPatients.length} patients</span>
              </div>

              <div className="adm-patients-grid">
                {filteredPatients.map((p, i) => (
                  <div
                    className="adm-patient-card"
                    key={p._id}
                    style={{ animationDelay: `${i * 0.04}s` }}
                    onClick={() => handlePatientClick(p)}
                  >
                    <div className="adm-doctor-avatar">{getInitials(p.fullName)}</div>
                    <div className="adm-doctor-info">
                      <div className="adm-doctor-name">{p.fullName}</div>
                      <div className="adm-doctor-email">{p.email}</div>
                    </div>
                    <span className="adm-patient-doctor">
                      {p.doctor ? `Dr. ${p.doctor}` : "No doctor"}
                    </span>
                  </div>
                ))}

                {filteredPatients.length === 0 && (
                  <div style={{ color: "#9ca3af", fontSize: 13, padding: "16px 4px" }}>
                    No patients found.
                  </div>
                )}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* Doctor Details Modal */}
      {showDoctorModal && doctorDetails && (
        <div className="modal-overlay" onClick={() => setShowDoctorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Doctor Details</h2>
            {editDoctorMode ? (
              <form onSubmit={handleSaveDoctorEdit}>
                <div className="adm-field">
                  <label>Name</label>
                  <input
                    className="adm-input"
                    type="text"
                    name="name"
                    value={editDoctorForm.name}
                    onChange={handleDoctorEditChange}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Email</label>
                  <input
                    className="adm-input"
                    type="email"
                    name="email"
                    value={editDoctorForm.email}
                    onChange={handleDoctorEditChange}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Phone</label>
                  <input
                    className="adm-input"
                    type="tel"
                    name="mobile"
                    value={editDoctorForm.mobile}
                    onChange={handleDoctorEditChange}
                  />
                </div>
                <div className="adm-field">
                  <label>New Password (leave empty to keep current)</label>
                  <input
                    className="adm-input"
                    type="password"
                    name="password"
                    value={editDoctorForm.password}
                    onChange={handleDoctorEditChange}
                    placeholder="Enter new password or leave blank"
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button type="submit" className="adm-submit-btn" disabled={loadingDoctorEdit}>
                    {loadingDoctorEdit ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditDoctorMode(false)}
                    disabled={loadingDoctorEdit}
                    style={{ background: "#9ca3af", padding: "10px 20px", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", opacity: loadingDoctorEdit ? 0.6 : 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p><strong>Name:</strong> {doctorDetails.name}</p>
                <p><strong>Email:</strong> {doctorDetails.email}</p>
                <p><strong>Phone:</strong> {doctorDetails.mobile || 'N/A'}</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button onClick={handleDoctorEdit} className="adm-submit-btn">Edit</button>
                  <button onClick={() => setShowDoctorModal(false)} style={{ background: "#9ca3af", padding: "10px 20px", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientModal && patientDetails && (
        <div className="modal-overlay" onClick={() => setShowPatientModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <h2>Patient Details</h2>
            {editPatientMode ? (
              <form onSubmit={handleSavePatientEdit} style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="adm-field">
                  <label>Full Name</label>
                  <input
                    className="adm-input"
                    type="text"
                    name="fullName"
                    value={editPatientForm.fullName}
                    onChange={handlePatientEditChange}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Email</label>
                  <input
                    className="adm-input"
                    type="email"
                    name="email"
                    value={editPatientForm.email}
                    onChange={handlePatientEditChange}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Age</label>
                  <input
                    className="adm-input"
                    type="number"
                    name="age"
                    value={editPatientForm.age}
                    onChange={handlePatientEditChange}
                  />
                </div>
                <div className="adm-field">
                  <label>Gender</label>
                  <input
                    className="adm-input"
                    type="text"
                    name="gender"
                    value={editPatientForm.gender}
                    onChange={handlePatientEditChange}
                  />
                </div>
                <div className="adm-field">
                  <label>Mobile</label>
                  <input
                    className="adm-input"
                    type="tel"
                    name="mobile"
                    value={editPatientForm.mobile}
                    onChange={handlePatientEditChange}
                  />
                </div>
                <div className="adm-field">
                  <label>Address</label>
                  <input
                    className="adm-input"
                    type="text"
                    name="address"
                    value={editPatientForm.address}
                    onChange={handlePatientEditChange}
                  />
                </div>
                <div className="adm-field">
                  <label>Blood Group</label>
                  <input
                    className="adm-input"
                    type="text"
                    name="bloodGroup"
                    value={editPatientForm.bloodGroup}
                    onChange={handlePatientEditChange}
                  />
                </div>
                <div className="adm-field">
                  <label>Height (cm)</label>
                  <input
                    className="adm-input"
                    type="number"
                    name="height"
                    value={editPatientForm.height}
                    onChange={handlePatientEditChange}
                  />
                </div>
                <div className="adm-field">
                  <label>Weight (kg)</label>
                  <input
                    className="adm-input"
                    type="number"
                    name="weight"
                    value={editPatientForm.weight}
                    onChange={handlePatientEditChange}
                  />
                </div>
                <div className="adm-field">
                  <label>New Password (leave empty to keep current)</label>
                  <input
                    className="adm-input"
                    type="password"
                    name="password"
                    value={editPatientForm.password}
                    onChange={handlePatientEditChange}
                    placeholder="Enter new password or leave blank"
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button type="submit" className="adm-submit-btn" disabled={loadingPatientEdit}>
                    {loadingPatientEdit ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditPatientMode(false)}
                    disabled={loadingPatientEdit}
                    style={{ background: "#9ca3af", padding: "10px 20px", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", opacity: loadingPatientEdit ? 0.6 : 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p><strong>Patient ID:</strong> {patientDetails.patientId}</p>
                <p><strong>Name:</strong> {patientDetails.fullName}</p>
                <p><strong>Email:</strong> {patientDetails.email}</p>
                <p><strong>Age:</strong> {patientDetails.age || 'N/A'}</p>
                <p><strong>Gender:</strong> {patientDetails.gender || 'N/A'}</p>
                <p><strong>Mobile:</strong> {patientDetails.mobile || 'N/A'}</p>
                <p><strong>Address:</strong> {patientDetails.address || 'N/A'}</p>
                <p><strong>Blood Group:</strong> {patientDetails.bloodGroup || 'N/A'}</p>
                <p><strong>Height:</strong> {patientDetails.height ? `${patientDetails.height} cm` : 'N/A'}</p>
                <p><strong>Weight:</strong> {patientDetails.weight ? `${patientDetails.weight} kg` : 'N/A'}</p>
                <p><strong>Doctor:</strong> {selectedPatient.doctor ? `Dr. ${selectedPatient.doctor}` : 'No doctor assigned'}</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                  <button onClick={handlePatientEdit} className="adm-submit-btn">Edit</button>
                  <button onClick={() => setShowPatientModal(false)} style={{ background: "#9ca3af", padding: "10px 20px", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;