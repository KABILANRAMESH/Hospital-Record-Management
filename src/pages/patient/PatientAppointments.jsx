import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientAppointments.css";

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/patients/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAppointments(res.data))
      .catch(() => {
        alert("Failed to load appointments");
      });
  }, [navigate]);

  return (
    <div className="patient-appointments">
      <h1>My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.doctorId?.name}</td>
                <td>{a.date}</td>
                <td>
                  <span className={`status ${a.status}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/patient/dashboard")}>Back</button>
    </div>
  );
}

export default PatientAppointments;
