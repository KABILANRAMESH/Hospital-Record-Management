import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  // SAFE user read
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const [appointments, setAppointments] = useState([]);

  const [showRecordBox, setShowRecordBox] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  const [showUploadBox, setShowUploadBox] = useState(false);
  const [reportFile, setReportFile] = useState(null);

  // AUTH GUARD
  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/");
      return;
    }
    fetchAppointments();
  }, [navigate]);

  // FETCH APPOINTMENTS
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      alert("Session expired. Please login again.");
      localStorage.clear();
      navigate("/");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/doctor/appointments/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch {
      alert("Failed to update status");
    }
  };

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
      alert("Failed to upload report");
    }
  };

  const viewReport = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(
        `/api/doctor/appointments/${id}/report`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const fileURL = URL.createObjectURL(res.data);
      window.open(fileURL, "_blank");
    } catch {
      alert("Failed to open report");
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(
        `/api/doctor/appointments/${id}/report`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch {
      alert("Failed to delete report");
    }
  };

  if (!user) return null;

  return (
    <div className="layout">
      {/* SIDEBAR */}
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

      {/* MAIN */}
      <div className="main">
        <div className="top-header">
          <h3>Appointments</h3>
          <button
            className="btn reject"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>

        <div className="content">
         {appointments.map((appt) => (
  <div className="appointment-card" key={appt._id}>
    <div>
      <h4>{appt.patientId?.fullName || "Patient"}</h4>

      <span className={`status ${appt.status}`}>
        {appt.status}
      </span>
    </div>

    <div className="card-actions">
      {appt.status === "pending" && (
        <>
          <button
            className="btn approve"
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

      <button
        className="btn record"
        onClick={() => {
          setSelectedApptId(appt._id);
          setShowRecordBox(true);
        }}
      >
        Add Record
      </button>

      <button
        className="btn upload"
        onClick={() => {
          setSelectedApptId(appt._id);
          setShowUploadBox(true);
        }}
      >
        Upload Report
      </button>

      <button
        className="btn view"
        onClick={() => viewReport(appt._id)}
      >
        View Report
      </button>

      <button
        className="btn delete"
        onClick={() => deleteReport(appt._id)}
      >
        Delete Report
      </button>
    </div>
  </div>
))}

        </div>
      </div>

      {/* MEDICAL RECORD MODAL */}
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

      {/* UPLOAD REPORT MODAL */}
      {showUploadBox && (
        <div className="modal">
          <div className="modal-box">
            <h3>Upload Report</h3>
            <input
              type="file"
              onChange={(e) => setReportFile(e.target.files[0])}
            />
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
