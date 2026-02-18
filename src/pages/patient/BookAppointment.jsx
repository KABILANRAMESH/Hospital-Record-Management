import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BookAppointment.css";
import PatientLayout from "../../components/layouts/PatientLayout";

function BookAppointment() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch doctors (FAST + SAFE)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        // ✅ Cache check (optional but powerful)
        const cached = sessionStorage.getItem("doctors");
        if (cached) {
          setDoctors(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/patients/doctors",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDoctors(res.data);
        sessionStorage.setItem("doctors", JSON.stringify(res.data));
      } catch (err) {
        alert("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // 🔹 Book appointment
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Appointment request sent successfully ✅");
      navigate("/patient/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <PatientLayout active="book">
      <div className="book-appointment-wrapper">
        <div className="book-appointment-card">

          {/* HEADER */}
          <div className="header-section">
            <div className="icon-wrapper">
              📅
            </div>
            <h2>Book Your Appointment</h2>
            <p className="subtitle">
              Choose your preferred doctor and date
            </p>
          </div>

          {/* FORM */}
          <div className="form-section">
            {/* DOCTOR SELECT */}
            <div className="form-group">
              <label>Select Doctor</label>

              {loading ? (
                <p className="loading-text">Loading doctors...</p>
              ) : (
                <select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* DATE SELECT */}
            <div className="form-group">
              <label>Select Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleBook}
              className="book-button"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Book Appointment"}
            </button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}

export default BookAppointment;
