import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [appointments, setAppointments] = useState([]);

  // medical record
  const [showRecordBox, setShowRecordBox] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  // report upload
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [reportFile, setReportFile] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/");
      return;
    }
    fetchAppointments();
    // eslint-disable-next-line
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "http://localhost:5000/api/doctor/appointments",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAppointments(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/doctor/appointments/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAppointments();
  };

  const saveMedicalRecord = async () => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/doctor/appointments/${selectedApptId}/medical-record`,
      { diagnosis, prescription, notes },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setShowRecordBox(false);
    setDiagnosis("");
    setPrescription("");
    setNotes("");
    fetchAppointments();
  };

  const uploadReport = async () => {
    if (!reportFile) return alert("Select a file");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("report", reportFile);

    await axios.post(
      `http://localhost:5000/api/doctor/appointments/${selectedApptId}/report`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setShowUploadBox(false);
    setReportFile(null);
    fetchAppointments();
  };

 const viewReport = async id => {
  const token = localStorage.getItem("token");

  const res = await axios.get(
    `http://localhost:5000/api/doctor/appointments/${id}/report`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    }
  );

  // 🔥 USE THE BLOB DIRECTLY
  const fileURL = URL.createObjectURL(res.data);
  window.open(fileURL, "_blank");
};


  const deleteReport = async id => {
    if (!window.confirm("Delete this report?")) return;
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:5000/api/doctor/appointments/${id}/report`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAppointments();
  };

  if (!user) return null;

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1 className="sidebar-title">
          Doctor <br />
          <span>Dashboard</span>
        </h1>

        <div className="online">
          <span className="dot" />
          Dr. {user.name} — Online
        </div>

        <div className="sidebar-cards">
          <div className="side-card">
            <h2>{appointments.length}</h2>
            <p>Appointments</p>
          </div>
          <div className="side-card amber">
            <h2>{appointments.filter(a => a.status === "pending").length}</h2>
            <p>Pending</p>
          </div>
          <div className="side-card indigo">
            <h2>{appointments.filter(a => a.status === "approved").length}</h2>
            <p>Approved</p>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="top-header">
          <input placeholder=" Search" />
          <button onClick={() => { localStorage.clear(); navigate("/"); }}>
            Logout
          </button>
        </header>

        <section className="content">
          <h3>Appointment Requests</h3>

          {appointments.map(appt => (
            <div className="appointment-card" key={appt._id}>
              <div>
                <h4>{appt.patientId.fullName}</h4>
                <p>{new Date(appt.appointmentDate).toDateString()}</p>
                <span className={`status ${appt.status}`}>
                  {appt.status.toUpperCase()}
                </span>
              </div>

              <div className="card-actions">
                {appt.status === "pending" && (
                  <>
                    <button className="btn approve" onClick={() => updateStatus(appt._id, "approved")}>Approve</button>
                    <button className="btn reject" onClick={() => updateStatus(appt._id, "rejected")}>Reject</button>
                  </>
                )}

                {appt.status === "approved" && (
                  <>
                    <button className="btn record" onClick={() => {
                      setSelectedApptId(appt._id);
                      setDiagnosis(appt.medicalRecord?.diagnosis || "");
                      setPrescription(appt.medicalRecord?.prescription || "");
                      setNotes(appt.medicalRecord?.notes || "");
                      setShowRecordBox(true);
                    }}>Medical Record</button>

                    {appt.report?.fileName ? (
                      <>
                        <button className="btn view" onClick={() => viewReport(appt._id)}>View</button>
                        <button className="btn delete" onClick={() => deleteReport(appt._id)}>Delete</button>
                      </>
                    ) : (
                      <button className="btn upload" onClick={() => {
                        setSelectedApptId(appt._id);
                        setShowUploadBox(true);
                      }}>Upload</button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* MODALS */}
      {showRecordBox && (
        <div className="modal">
          <div className="modal-box">
            <h3>Medical Record</h3>
            <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="Diagnosis" />
            <input value={prescription} onChange={e => setPrescription(e.target.value)} placeholder="Prescription" />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes" />
            <div className="modal-actions">
              <button onClick={() => setShowRecordBox(false)}>Cancel</button>
              <button onClick={saveMedicalRecord}>Save</button>
            </div>
          </div>
        </div>
      )}

      {showUploadBox && (
        <div className="modal">
          <div className="modal-box">
            <h3>Upload Report</h3>
            <input type="file" onChange={e => setReportFile(e.target.files[0])} />
            <div className="modal-actions">
              <button onClick={() => setShowUploadBox(false)}>Cancel</button>
              <button onClick={uploadReport}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
