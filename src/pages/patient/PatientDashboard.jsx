import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";
import PatientLayout from "../../components/layouts/PatientLayout";
import HealthChat from "../../components/layouts/HealthChat";

function BedAllocationTab() {
  const bedData = [
    { ward: "General Ward", total: 50, occupied: 35, available: 15 },
    { ward: "ICU", total: 20, occupied: 18, available: 2 },
    { ward: "Emergency", total: 30, occupied: 22, available: 8 },
    { ward: "Pediatric", total: 25, occupied: 15, available: 10 },
    { ward: "Maternity", total: 15, occupied: 12, available: 3 },
  ];

  return (
    <div className="pro-card">
      <h2 className="section-title">
        <span className="material-symbols-outlined">bed</span>
        Bed Allocation Status
      </h2>
      <br />
      <div className="bed-allocation-grid">
        {bedData.map((ward, index) => (
          <div key={index} className="bed-card">
            <h3>{ward.ward}</h3>
            <div className="bed-stats">
              <div className="bed-stat">
                <span className="label">Total Beds:</span>
                <span className="value">{ward.total}</span>
              </div>
              <div className="bed-stat occupied">
                <span className="label">Occupied:</span>
                <span className="value">{ward.occupied}</span>
              </div>
              <div className="bed-stat available">
                <span className="label">Available:</span>
                <span className="value">{ward.available}</span>
              </div>
            </div>
            <div className="bed-bar">
              <div
                className="occupied-bar"
                style={{ width: `${(ward.occupied / ward.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatientDashboard() {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const storedPatient = localStorage.getItem("patient");
    if (!storedPatient) {
      navigate("/");
    } else {
      setPatient(JSON.parse(storedPatient));
    }
  }, [navigate]);

  if (!patient) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <PatientLayout active="dashboard">
      {/* HEADER */}
      <div className="pro-header">
        <div>
          <h1>{patient.fullName}</h1>
        </div>

        
      </div>

      {/* TABS */}
      <div className="tabs">
        <button
          className={activeTab === "overview" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "bed-allocation" ? "tab-btn active" : "tab-btn"}
          onClick={() => setActiveTab("bed-allocation")}
        >
          Bed Allocation
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "overview" && (
        <>
          {/* STATS */}
          <div className="pro-stats">
        <StatCard
  title="Patient ID"
  value={patient.patientId}
icon="fingerprint"
  color="purple"
/>

<StatCard
  title="Blood Group"
  value={patient.bloodGroup}
  icon="bloodtype"
  color="blue"
/>

<StatCard
  title="Health Status"
  value="Good"
  icon="monitor_heart"
  color="green"
/>
      </div>

      {/* DETAILS */}
      <div className="pro-card">
        <h2 className="section-title">
  <span className="material-symbols-outlined">person</span>
  Personal Information
</h2>
<br></br>
        <div className="pro-info-grid">
          <Info label="Full Name" value={patient.fullName} />
          <Info label="Email" value={patient.email} />
          <Info label="Mobile" value={patient.mobile} />
          <Info label="Gender" value={patient.gender} />
          <Info label="Age" value={`${patient.age} years`} />
          <Info label="Height" value={`${patient.height} cm`} />
          <Info label="Weight" value={`${patient.weight} kg`} />
          <Info label="Address" value={patient.address} full />
        </div>
      </div>

          {/* HEALTH TIP */}
          <div className="health-tip">
            <div className="tip-icon">💡</div>
            <div>
              <h3>Health Insight</h3>
              <p>
                Stay hydrated and maintain a balanced diet. Your vitals look stable.
                Continue regular exercise and proper sleep.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "bed-allocation" && (
        <BedAllocationTab />
      )}

      <HealthChat />
    </PatientLayout>
  );
}

/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, unit, icon, color }) {
  return (
    <div className={`pro-stat ${color}`}>
      <div className="stat-icon">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p>{title}</p>
        <h3>
          {value} {unit}
        </h3>
      </div>
    </div>
  );
}

function Info({ label, value, full }) {
  return (
    <div className={`pro-info ${full ? "full" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default PatientDashboard;
