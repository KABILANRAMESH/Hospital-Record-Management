import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BookAppointment.css";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");

  // 🔹 fetch doctors from DB
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/patients/doctors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDoctors(res.data);
      } catch (err) {
        alert("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  // 🔹 book appointment
  const handleBook = async () => {
    if (!doctorId || !date) {
      alert("Please select doctor and date");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/patients/appointments",
        {
          doctorId,
          appointmentDate: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     alert("Appointment request sent");
    navigate("/patient/dashboard");
  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Failed to book appointment");
  }
};

  return (
    <div className="book-appointment">
      <h2>Book Appointment</h2>

      <label>Select Doctor</label>
      <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
        <option value="">-- Select Doctor --</option>
        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.name}
          </option>
        ))}
      </select>

      <label>Select Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={handleBook}>Book Appointment</button>
    </div>
  );
}

export default BookAppointment;
