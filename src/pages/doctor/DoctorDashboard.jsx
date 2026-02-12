import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  // read user ONCE
  const user = JSON.parse(localStorage.getItem("user"));

  const [appointments, setAppointments] = useState([]);

  // medical record states
  const [showRecordBox, setShowRecordBox] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);

  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  // 🔐 Auth check + load appointments (RUN ONCE)
  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/");
      return;
    }

    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Fetch appointment requests
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/doctor/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data);
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to load appointments");
    }
  };

  // 🔹 Approve / Reject appointment
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/doctor/appointments/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAppointments();
    } catch (err) {
      alert("Failed to update appointment");
    }
  };

  // 🔹 Save / Update medical record
  const saveMedicalRecord = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/doctor/appointments/${selectedApptId}/medical-record`,
        {
          diagnosis,
          prescription,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Medical record saved ✅");

      setShowRecordBox(false);
      setDiagnosis("");
      setPrescription("");
      setNotes("");

      fetchAppointments();
    } catch (err) {
      alert("Failed to save medical record ❌");
    }
  };

  if (!user) return null;

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      <p className="doctor-name">Welcome, Dr. {user.name}</p>

      {/* CARDS */}
      <div className="cards">
        <div className="card">
          <h3>Total Appointments</h3>
          <p>{appointments.length}</p>
        </div>

        <div className="card">
          <h3>Pending Requests</h3>
          <p>{appointments.filter(a => a.status === "pending").length}</p>
        </div>

        <div className="card">
          <h3>Approved</h3>
          <p>{appointments.filter(a => a.status === "approved").length}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-section">
        <h3>Appointment Requests</h3>

        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="4">No appointment requests</td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{appt.patientId.fullName}</td>
                  <td>
                    {new Date(appt.appointmentDate).toLocaleDateString()}
                  </td>
                  <td>{appt.status}</td>
                  <td>
                    {appt.status === "pending" ? (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => updateStatus(appt._id, "approved")}
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => updateStatus(appt._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : appt.status === "approved" ? (
                      <button
                        className="record-btn"
                        onClick={() => {
                          setSelectedApptId(appt._id);
                          setDiagnosis(appt.medicalRecord?.diagnosis || "");
                          setPrescription(
                            appt.medicalRecord?.prescription || ""
                          );
                          setNotes(appt.medicalRecord?.notes || "");
                          setShowRecordBox(true);
                        }}
                      >
                        {appt.medicalRecord
                          ? "View / Edit Record"
                          : "Add Medical Record"}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MEDICAL RECORD MODAL */}
      {showRecordBox && (
        <div className="record-modal">
          <div className="record-box">
            <h3>Medical Record</h3>

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

            <div className="record-actions">
              <button onClick={saveMedicalRecord}>Save</button>
              <button onClick={() => setShowRecordBox(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default DoctorDashboard;
