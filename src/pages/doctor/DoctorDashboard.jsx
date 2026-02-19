import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [appointments, setAppointments] = useState([]);

  const [showRecordBox, setShowRecordBox] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  const [showUploadBox, setShowUploadBox] = useState(false);
  const [reportFile, setReportFile] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "doctor") {
      navigate("/");
      return;
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get(
      "/api/doctor/appointments",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setAppointments(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await api.put(
      `/api/doctor/appointments/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAppointments();
  };

  const saveMedicalRecord = async () => {
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
  };

  const uploadReport = async () => {
    if (!reportFile) return alert("Select a file");

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
  };

  const viewReport = async id => {
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
  };

  const deleteReport = async id => {
    if (!window.confirm("Delete this report?")) return;
    const token = localStorage.getItem("token");
    await api.delete(
      `/api/doctor/appointments/${id}/report`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAppointments();
  };

  if (!user) return null;

  return (
    /* JSX UNCHANGED */
    <div className="layout">{/* …same JSX as before… */}</div>
  );
}

export default DoctorDashboard;
