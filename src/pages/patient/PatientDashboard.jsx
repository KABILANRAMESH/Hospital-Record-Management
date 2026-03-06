import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";
import PatientLayout from "../../components/layouts/PatientLayout";
import HealthChat from "../../components/layouts/HealthChat";

function PatientDashboard() {
  const [patient, setPatient] = useState(null);
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
          <p>
            Patient ID: <span>{patient.patientId}</span>
          </p>
        </div>

        
      </div>

      {/* STATS */}
      <div className="pro-stats">
        <StatCard
  title="Heart Rate"
  value="72"
  unit="bpm"
  icon="favorite"
  color="rose"
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
