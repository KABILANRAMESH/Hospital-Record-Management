import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ role }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h3>{role.toUpperCase()}</h3>

      {role === "patient" && (
        <>
          <button onClick={() => navigate("/patient/dashboard")}>
            Dashboard
          </button>
          <button onClick={() => navigate("/patient/book-appointment")}>
            Book Appointment
          </button>
          <button onClick={() => navigate("/patient/medical-history")}>
            Medical History
          </button>
        </>
      )}

      {role === "doctor" && (
        <>
          <button onClick={() => navigate("/doctor/dashboard")}>
            Dashboard
          </button>
        </>
      )}

      {role === "admin" && (
        <>
          <button onClick={() => navigate("/admin/dashboard")}>
            Dashboard
          </button>
        </>
      )}
    </div>
  );
}

export default Sidebar;
