import { useNavigate } from "react-router-dom";
import "./PatientLayout.css";

function PatientLayout({ children, active }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar light">
        <div className="logo">
          <div className="logo-icon">🛡️</div>
          <span>HealthSync</span>
        </div>

        <nav>
          <button
            className={active === "dashboard" ? "nav-btn active" : "nav-btn"}
            onClick={() => navigate("/patient/dashboard")}
          >
            <span className="icon">⬛</span>
            Dashboard
          </button>

          <button
            className={active === "appointments" ? "nav-btn active" : "nav-btn"}
            onClick={() => navigate("/patient/appointments")}
          >
            <span className="icon">📅</span>
            Appointments
          </button>

          <button
            className={active === "medical" ? "nav-btn active" : "nav-btn"}
            onClick={() => navigate("/patient/medical-history")}
          >
            <span className="icon">📄</span>
            Medical Records
          </button>

          <p className="section-label">ACTIONS</p>

          <button
            className="nav-btn outline"
            onClick={() => navigate("/patient/book-appointment")}
          >
            <span className="icon">➕</span>
            Book Appointment
          </button>
        </nav>

        <button
          className="nav-btn logout"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          
        >
          <span className="icon">🚪</span>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="content">{children}</main>
    </div>
  );
}

export default PatientLayout;
