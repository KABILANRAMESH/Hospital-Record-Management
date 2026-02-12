import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientMedicalHistory.css";

function PatientMedicalHistory() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/patients/medical-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecords(res.data);
    } catch (err) {
      alert("Failed to load medical history");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">💙 HealthSync</h2>

        <nav>
          <button onClick={() => navigate("/patient/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/patient/appointments")}>
            Appointments
          </button>
          <button className="active">Medical Records</button>
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
        <h1>Medical History</h1>

        {records.length === 0 ? (
          <p>No medical records available</p>
        ) : (
          records.map((rec) => (
            <div key={rec._id} className="record-card">
              <h3>
                {new Date(rec.appointmentDate).toLocaleDateString()}
              </h3>

              <p>
                <strong>Doctor:</strong> Dr. {rec.doctorId.name}
              </p>

              <p>
                <strong>Diagnosis:</strong>{" "}
                {rec.medicalRecord?.diagnosis || "—"}
              </p>

              <p>
                <strong>Prescription:</strong>{" "}
                {rec.medicalRecord?.prescription || "—"}
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {rec.medicalRecord?.notes || "—"}
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default PatientMedicalHistory;
