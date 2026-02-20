import { useEffect, useMemo, useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import "./PatientAppointments.css";
import PatientLayout from "../../components/layouts/PatientLayout";

function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* 🔹 FETCH APPOINTMENTS (runs only once) */
  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);

        const res = await api.get(
          "/api/patients/appointments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(res.data);
      } catch (err) {
        alert("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  /* 🔹 FAST FILTER (memoized) */
  const filteredAppointments = useMemo(() => {
    if (statusFilter === "all") return appointments;

    return appointments.filter(
      (a) => a.status?.toLowerCase() === statusFilter
    );
  }, [appointments, statusFilter]);

  /* 🔹 DATE FORMAT */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <PatientLayout active="appointments">
      <div className="pa-page">
        {/* HEADER */}
        <header className="pa-header">
          <div>
            <h1>My Appointments</h1>
            <p>Manage and track your upcoming medical visits</p>
          </div>

          <div className="pa-filter">
            <span className="material-icons-round">filter_list</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </header>

        {/* CONTENT */}
        {loading ? (
          <div className="pa-grid">
            {[1, 2, 3].map((i) => (
              <div className="pa-card skeleton" key={i}></div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <p className="pa-loading">No appointments found</p>
        ) : (
          <>
            <div className="pa-grid">
              {filteredAppointments.map((a) => (
                <div className="pa-card" key={a._id}>
                  <div className="pa-card-top">
                    <div>
                      <h3>{a.doctorId?.name || "Doctor"}</h3>
                      <span className="specialty">
                        General Physician
                      </span>
                    </div>

                    <span className={`pa-status ${a.status}`}>
                      {a.status}
                    </span>
                  </div>

                  <div className="pa-card-body">
                    <div className="info">
                      <span className="material-icons-round">Event:</span>
                      <span>{formatDate(a.appointmentDate)}</span>
                    </div>

                    <div className="info">
  <span className="material-icons-round">Schedule:</span>

  {a.status === "approved" && a.visitTime ? (
    <span className="visit-time">
      ⏰ {a.visitTime}
    </span>
  ) : (
    <span className="visit-pending">
      To be assigned
    </span>
  )}
</div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="pa-footer">
              <div className="legend">
                <span>
                  <i className="dot approved"></i> Approved
                </span>
                <span>
                  <i className="dot pending"></i> Pending
                </span>
              </div>
              <p>© 2024 HealthCare Connect Patient Portal</p>
            </footer>
          </>
        )}
      </div>
    </PatientLayout>
  );
}

export default PatientAppointments;
