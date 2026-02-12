import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

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

  if (!patient) return <p className="loading">Loading...</p>;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">💙 HealthSync</h2>

        <nav>
          <button className="active">Dashboard</button>
          <button onClick={() => navigate("/patient/appointments")}>
            Appointments
          </button>
          <button onClick={() => navigate("/patient/medical-history")}>
            Medical Records
          </button>
          <button onClick={() => navigate("/patient/book-appointment")}>
            Book Appointment
          </button>
          <button
            className="logout"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="content">
        {/* HEADER CARD */}
        <div className="header-card">
          <h1>Patient Dashboard</h1>
          <p>
            Patient ID: <strong>{patient.patientId}</strong>
          </p>
        </div>

        {/* INFO CARD */}
        <div className="card">
          <h2>General Information</h2>

          <div className="info-grid">
            <p><strong>Name:</strong> {patient.fullName}</p>
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Mobile:</strong> {patient.mobile}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
            <p><strong>Height:</strong> {patient.height} cm</p>
            <p><strong>Weight:</strong> {patient.weight} kg</p>

            <p className="full">
              <strong>Address:</strong> {patient.address}
            </p>
          </div>
        </div>

        {/* EXTRA FILL CARD (optional but recommended) */}
        <div className="card tip">
          <h3>💡 Health Tip</h3>
          <p>
            Stay hydrated and maintain a balanced diet. Regular checkups help
            prevent future health issues.
          </p>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;
