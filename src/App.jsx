import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientMedicalHistory from "./pages/patient/PatientMedicalHistory"; // ✅ CORRECT
import PatientAppointments from "./pages/patient/PatientAppointments";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<PatientAppointments />}/>
        <Route path="/patient/medical-history" element={<PatientMedicalHistory />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
