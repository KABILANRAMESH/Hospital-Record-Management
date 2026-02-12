import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./MedicalHistory.css";

function MedicalHistory() {
  const patientData = JSON.parse(localStorage.getItem("patientData"));

  // Dummy medical history (frontend simulation)
  const medicalHistory = [
    {
      date: "01-02-2026",
      doctor: "Dr. Arun",
      diagnosis: "Fever",
      prescription: "Paracetamol, Rest",
      report: "Blood Test",
    },
    {
      date: "15-01-2026",
      doctor: "Dr. Meena",
      diagnosis: "Back Pain",
      prescription: "Pain relief tablets, Physiotherapy",
      report: "X-Ray",
    },
  ];

  if (!patientData) {
    return <h2>No patient data found</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar role="patient" />

        <div className="dashboard-content">
          <h1>Medical History</h1>

          {/* Patient Info */}
          <div className="patient-info-card">
            <p><strong>Patient ID:</strong> {patientData.patientId}</p>
            <p><strong>Name:</strong> {patientData.fullName}</p>
            <p><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
          </div>

          {/* Medical Records */}
          <div className="history-section">
            {medicalHistory.map((record, index) => (
              <div className="history-card" key={index}>
                <div className="history-header">
                  <h3>Visit Date: {record.date}</h3>
                  <span>{record.doctor}</span>
                </div>

                <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                <p><strong>Prescription:</strong> {record.prescription}</p>
                <p><strong>Report:</strong> {record.report}</p>

                <button className="view-btn">View Report</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MedicalHistory;
