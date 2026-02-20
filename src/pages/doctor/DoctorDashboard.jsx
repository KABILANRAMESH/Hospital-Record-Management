import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const [appointments, setAppointments] = useState([]);

  const [showRecordBox, setShowRecordBox] = useState(false);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [showTimeBox, setShowTimeBox] = useState(false);

  const [selectedApptId, setSelectedApptId] = useState(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  // 🔥 store time per appointment
  const [visitTimes, setVisitTimes] = useState({});

  const [tempTime, setTempTime] = useState("");
  const [reportFile, setReportFile] = useState(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/");
      return;
    }
    fetchAppointments();
  }, [navigate]);

  /* ================= FETCH ================= */
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch {
      alert("Session expired");
      localStorage.clear();
      navigate("/");
    }
  };

  /* ================= APPROVE / REJECT ================= */
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/api/doctor/appointments/${id}`,
        {
          status,
          visitTime: visitTimes[id] || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchAppointments();
    } catch {
      alert("Failed to update status");
    }
  };

  /* ================= MEDICAL RECORD ================= */
  const saveMedicalRecord = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/doctor/appointments/${selectedApptId}/medical-record`,
        { diagnosis, prescription, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowRecordBox(false);
      setDiagnosis("");
      setPrescription("");
      setNotes("");
      fetchAppointments();
    } catch {
      alert("Failed to save medical record");
    }
  };

  /* ================= REPORT ================= */
  const uploadReport = async () => {
    if (!reportFile) return alert("Select a file");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("report", reportFile);

      await api.post(
        `/api/doctor/appointments/${selectedApptId}/report`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowUploadBox(false);
      setReportFile(null);
      fetchAppointments();
    } catch {
      alert("Upload failed");
    }
  };

  const viewReport = async (id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/api/doctor/appointments/${id}/report`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    window.open(URL.createObjectURL(res.data));
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete report?")) return;
    const token = localStorage.getItem("token");
    await api.delete(`/api/doctor/appointments/${id}/report`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAppointments();
  };

  if (!user) return null;

  return (
    <div className="layout">
      {/* ========== SIDEBAR ========== */}
      <aside className="sidebar">
        <h2 className="sidebar-title">
          Doctor <span>Panel</span>
        </h2>

        <div className="online">
          <div className="dot"></div>
          Online
        </div>

        <div className="sidebar-cards">
          <div className="side-card amber">
            <strong>Total Appointments</strong>
            <p>{appointments.length}</p>
          </div>

          <div className="side-card indigo">
            <strong>Doctor</strong>
            <p>{user.fullName || user.name}</p>
          </div>
        </div>
      </aside>

      {/* ========== MAIN ========== */}
      <div className="main">
        <div className="top-header">
          <h3>Appointments</h3>
          <button className="btn reject" onClick={() => navigate("/")}>
            Logout
          </button>
        </div>

        <div className="content">
          {appointments.map((appt) => (
            <div className="appointment-card" key={appt._id}>
              <div>
                <h4>{appt.patientId?.fullName || "Patient"}</h4>

                <p className="appt-date">
                  📅 {new Date(appt.appointmentDate).toLocaleDateString()}
                </p>

                {appt.visitTime && (
                  <p className="appt-time">⏰ {appt.visitTime}</p>
                )}

                <span className={`status ${appt.status}`}>
                  {appt.status}
                </span>
              </div>

              <div className="card-actions">
                {appt.status === "pending" && (
                  <>
                    <button
                      className="time-chip"
                      onClick={() => {
                        setSelectedApptId(appt._id);
                        setTempTime(visitTimes[appt._id] || "");
                        setShowTimeBox(true);
                      }}
                    >
                      {visitTimes[appt._id] || "Set Time"} ⏰
                    </button>

                    <button
                      className="btn approve"
                      disabled={!visitTimes[appt._id]}
                      onClick={() => updateStatus(appt._id, "approved")}
                    >
                      Approve
                    </button>

                    <button
                      className="btn reject"
                      onClick={() => updateStatus(appt._id, "rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* ===== MEDICAL RECORD BUTTON ===== */}
{appt.medicalRecord?.diagnosis ? (
  <button
    className="btn view"
    onClick={() => {
      setSelectedApptId(appt._id);
      setDiagnosis(appt.medicalRecord.diagnosis);
      setPrescription(appt.medicalRecord.prescription);
      setNotes(appt.medicalRecord.notes);
      setShowRecordBox(true);
    }}
  >
    View / Edit Record
  </button>
) : (
  <button
    className="btn record"
    onClick={() => {
      setSelectedApptId(appt._id);
      setDiagnosis("");
      setPrescription("");
      setNotes("");
      setShowRecordBox(true);
    }}
  >
    Add Record
  </button>
)}

                {!appt.report && (
                  <button
                    className="btn upload"
                    onClick={() => {
                      setSelectedApptId(appt._id);
                      setShowUploadBox(true);
                    }}
                  >
                    Upload Report
                  </button>
                )}

                {appt.report && (
                  <>
                    <button className="btn view" onClick={() => viewReport(appt._id)}>
                      View Report
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => deleteReport(appt._id)}
                    >
                      Delete Report
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== TIME MODAL ========== */}
      {showTimeBox && (
        <div className="modal">
          <div className="modal-box">
            <h3>Assign Visit Time</h3>
            <input
              type="time"
              value={tempTime}
              onChange={(e) => setTempTime(e.target.value)}
              className="time-modal-input"
            />

            <div className="modal-actions">
              <button
                className="btn reject"
                onClick={() => setShowTimeBox(false)}
              >
                Cancel
              </button>
              <button
                className="btn approve"
                disabled={!tempTime}
                onClick={() => {
                  setVisitTimes((prev) => ({
                    ...prev,
                    [selectedApptId]: tempTime,
                  }));
                  setShowTimeBox(false);
                }}
              >
                Save Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== RECORD MODAL ========== */}
      {showRecordBox && (
        <div className="modal">
          <div className="modal-box">
            <h3>Add Medical Record</h3>

            <input
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
            <input
              placeholder="Prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
            />
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn reject" onClick={() => setShowRecordBox(false)}>
                Cancel
              </button>
              <button className="btn approve" onClick={saveMedicalRecord}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== UPLOAD MODAL ========== */}
      {showUploadBox && (
        <div className="modal">
          <div className="modal-box">
            <h3>Upload Report</h3>

            <input type="file" onChange={(e) => setReportFile(e.target.files[0])} />

            <div className="modal-actions">
              <button className="btn reject" onClick={() => setShowUploadBox(false)}>
                Cancel
              </button>
              <button className="btn approve" onClick={uploadReport}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;