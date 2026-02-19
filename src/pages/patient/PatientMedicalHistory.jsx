import { useEffect, useState } from "react";
import api from "../../services/axios";
import "./PatientMedicalHistory.css";
import PatientLayout from "../../components/layouts/PatientLayout";

function PatientMedicalHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const res = await api.get(
        "/api/patients/medical-history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRecords(res.data);
    } catch {
      alert("Failed to load medical history");
    } finally {
      setLoading(false);
    }
  };

  // 👁 View report
  const viewReport = async (apptId) => {
    const token = localStorage.getItem("token");

    const res = await api.get(
      `/api/patients/appointments/${apptId}/report`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    const file = new Blob([res.data], {
      type: res.headers["content-type"],
    });

    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  // ⬇️ Download report
  const downloadReport = async (apptId, fileName = "medical-report") => {
    const token = localStorage.getItem("token");

    const res = await api.get(
      `/api/patients/appointments/${apptId}/report`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <PatientLayout active="medical">
      <div className="mh-container">
        <header className="mh-header">
          <h1>Medical History</h1>
          <p>View and track your previous consultations and treatments.</p>
        </header>

        <div className="timeline">
          {loading ? (
            <p className="loading-text">Loading medical history...</p>
          ) : records.length === 0 ? (
            <p className="loading-text">No medical records found.</p>
          ) : (
            records.map((rec, index) => (
              <div className="timeline-item" key={rec._id}>
                <div className={`timeline-dot ${index === 0 ? "active" : ""}`} />

                <div className={`timeline-card ${index === 0 ? "recent" : ""}`}>
                  <div className="card-header">
                    {index === 0 && <span className="badge">Most Recent</span>}

                    <h3>
                      {new Date(rec.appointmentDate).toLocaleDateString(
                        "en-US",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )}
                    </h3>

                    <div className="doctor">
                      <span className="material-symbols-outlined">person</span>
                      Dr. {rec.doctorId?.name || "—"}
                    </div>
                  </div>

                  <div className="card-grid">
                    <div>
                      <label>Diagnosis</label>
                      <p>{rec.medicalRecord?.diagnosis || "—"}</p>
                    </div>

                    <div>
                      <label>Prescription</label>
                      <p>{rec.medicalRecord?.prescription || "—"}</p>
                    </div>

                    <div>
                      <label>Notes</label>
                      <p className="muted">
                        {rec.medicalRecord?.notes || "—"}
                      </p>
                    </div>
                  </div>

                  {rec.report?.fileName && (
                    <div className="report-actions">
                      <button onClick={() => viewReport(rec._id)}>
                        View Report
                      </button>

                      <button
                        onClick={() =>
                          downloadReport(rec._id, rec.report.fileName)
                        }
                      >
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="mh-footer">
          <p>Showing records for the last 12 months</p>
        </footer>
      </div>
    </PatientLayout>
  );
}

export default PatientMedicalHistory;
