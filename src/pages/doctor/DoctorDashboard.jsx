import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import "./DoctorDashboard.css";

function DoctorDashboard() {
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const [appointments, setAppointments]     = useState([]);
  const [showRecordBox, setShowRecordBox]   = useState(false);
  const [showUploadBox, setShowUploadBox]   = useState(false);
  const [showTimeBox, setShowTimeBox]       = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);

  const [diagnosis, setDiagnosis]       = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes]               = useState("");
  const [visitTimes, setVisitTimes]     = useState({});
  const [tempTime, setTempTime]         = useState("");
  const [reportFile, setReportFile]     = useState(null);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(null);

  const [searchQuery, setSearchQuery]   = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  // track which cards are expanded (formerly flipped)
  const [expandedCards, setExpandedCards] = useState(new Set());

  /* ── FETCH ── */
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/doctor/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch {
      alert("Session expired");
      localStorage.clear();
      navigate("/");
    }
  };

  /* ── AUTH ── */
  useEffect(() => {
    if (!user || user.role !== "doctor") { navigate("/"); return; }
    fetchAppointments();
  }, [navigate]);

  /* ── STATUS ── */
  const updateStatus = async (id, status) => {
    setLoadingStatus(id);
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/doctor/appointments/${id}`,
        { status, visitTime: visitTimes[id] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch { alert("Failed to update status"); }
    finally { setLoadingStatus(null); }
  };

  /* ── RECORD ── */
  const saveMedicalRecord = async () => {
    setLoadingRecord(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/api/doctor/appointments/${selectedApptId}/medical-record`,
        { diagnosis, prescription, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowRecordBox(false);
      setDiagnosis(""); setPrescription(""); setNotes("");
      fetchAppointments();
    } catch { alert("Failed to save medical record"); }
    finally { setLoadingRecord(false); }
  };

  /* ── REPORT ── */
  const uploadReport = async () => {
    if (!reportFile) return alert("Select a file");
    setLoadingReport(true);
    try {
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
    } catch { alert("Upload failed"); }
    finally { setLoadingReport(false); }
  };

  const viewReport = async (id) => {
    const token = localStorage.getItem("token");
    const res = await api.get(`/api/doctor/appointments/${id}/report`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    window.open(URL.createObjectURL(res.data));
  };

  const deleteReport = async (id) => {
    if (!window.confirm("Delete report?")) return;
    const token = localStorage.getItem("token");
    await api.delete(`/api/doctor/appointments/${id}/report`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAppointments();
  };

  /* ── STATS ── */
  const stats = useMemo(() => ({
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === "pending").length,
    approved:  appointments.filter(a => a.status === "approved").length,
    completed: appointments.filter(a => a.status === "completed").length,
  }), [appointments]);

  /* ── FILTER ── */
  const filtered = useMemo(() =>
    appointments.filter(appt => {
      const name = appt.patientId?.fullName?.toLowerCase() || "";
      return (
        name.includes(searchQuery.toLowerCase()) &&
        (activeFilter === "all" || appt.status === activeFilter)
      );
    }),
  [appointments, searchQuery, activeFilter]);

  /* ── HELPERS ── */
  const getInitials = (name = "P") =>
    name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

  const toggleCard = (id) => {
    // open or collapse details for a card
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  if (!user) return null;

  const doctorName = user.fullName || user.name || "Doctor";

  return (
    <div className="doctor-layout">

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className="dr-sidebar">

        <div className="dr-brand">
          <div className="dr-brand-icon">🛡️</div>
          <span className="dr-brand-name">HealthSync</span>
        </div>

        {/* Nav */}
        <div className="dr-nav-item active">
          <span className="dr-nav-icon">📋</span>
          Appointments
        </div>

        <div className="dr-sidebar-divider" />

        <div className="dr-nav-label">Overview</div>

        <div className="dr-stat-row">
          <div className="dr-stat-pill">
            <span className="dr-stat-pill-label">📋 Total</span>
            <span className="dr-stat-pill-value">{stats.total}</span>
          </div>
          <div className="dr-stat-pill">
            <span className="dr-stat-pill-label">⏳ Pending</span>
            <span className="dr-stat-pill-value">{stats.pending}</span>
          </div>
          <div className="dr-stat-pill">
            <span className="dr-stat-pill-label">✅ Approved</span>
            <span className="dr-stat-pill-value">{stats.approved}</span>
          </div>
          <div className="dr-stat-pill">
            <span className="dr-stat-pill-label">🩺 Completed</span>
            <span className="dr-stat-pill-value">{stats.completed}</span>
          </div>
        </div>

        <div className="dr-sidebar-divider" />

        <div className="dr-nav-label">Actions</div>

        <button
          className="dr-logout-btn"
          onClick={() => { localStorage.clear(); navigate("/"); }}
        >
          <span className="dr-nav-icon">🚪</span>
          Logout
        </button>

        <div className="dr-user-card">
          <div className="dr-avatar">{getInitials(doctorName)}</div>
          <div className="dr-user-info">
            <div className="dr-user-name">{doctorName}</div>
            <div className="dr-user-role">
              <span className="dr-online-dot" style={{ marginRight: 5 }} />
              Physician · Online
            </div>
          </div>
        </div>

      </aside>

      {/* ══════════════ MAIN ══════════════ */}
      <div className="dr-main">

        {/* Hero banner */}
        <div className="dr-hero">
          <div className="dr-hero-title">Dr. {doctorName}</div>
          <div className="dr-hero-sub">
            {stats.total} appointments · {stats.pending} pending review
          </div>

          <div className="dr-hero-controls">
            <div className="dr-search-wrap">
              <span className="dr-search-icon">🔍</span>
              <input
                className="dr-search"
                placeholder="Search patient name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="dr-tabs">
              {["all", "pending", "approved", "rejected", "completed"].map(tab => (
                <button
                  key={tab}
                  className={`dr-tab${activeFilter === tab ? " active" : ""}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="dr-content">
          <div className="dr-grid">

            {filtered.length === 0 && (
              <div className="dr-empty">
                <div className="dr-empty-icon">🗂️</div>
                <p>No appointments found</p>
              </div>
            )}

           {filtered.map((appt, i) => (
  <div
    className={`dr-card ${expandedCards.has(appt._id) ? "expanded" : ""}`}
    key={appt._id}
    style={{ animationDelay: `${i * 0.04}s` }}
  >

    {/* Front Side */}
    <div className="dr-card-front" onClick={() => toggleCard(appt._id)}>
      <div className="dr-card-top">
                    <div className="dr-patient-avatar">
                      {getInitials(appt.patientId?.fullName)}
                    </div>
                    <div className="dr-patient-info">
                      <div className="dr-patient-name">
                        {appt.patientId?.fullName || "Patient"}
                      </div>
                      <div className="dr-card-meta">
                        <span className="dr-meta-chip">
                          📅 {formatDate(appt.appointmentDate)}
                        </span>
                        {appt.visitTime && (
                          <span className="dr-meta-chip">⏰ {appt.visitTime}</span>
                        )}
                      </div>
                    </div>
                    <span className={`dr-status ${appt.status}`}>
                      {appt.status}
                    </span>
                    <span className="dr-expand-icon">
                      {expandedCards.has(appt._id) ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Details section (shown when expanded) */}
                {expandedCards.has(appt._id) && (
                  <div className="dr-card-details">
                  {/* Diagnosis preview */}
                  {appt.medicalRecord?.diagnosis && (
                    <div className="dr-record-preview">
                      <div className="dr-record-preview-label">Diagnosis</div>
                      <div className="dr-record-preview-value">
                        {appt.medicalRecord.diagnosis}
                      </div>
                    </div>
                  )}

                  <div className="dr-card-divider" />

                  {/* Action buttons */}
                  <div className="dr-card-actions">

                    {appt.status === "pending" && (
                      <>
                        <button
                          className="dr-time-chip"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApptId(appt._id);
                            setTempTime(visitTimes[appt._id] || "");
                            setShowTimeBox(true);
                          }}
                        >
                          {visitTimes[appt._id] ? `⏰ ${visitTimes[appt._id]}` : "⏰ Set Time"}
                        </button>

                        <button
                          className="dr-btn dr-btn-approve"
                          disabled={!visitTimes[appt._id] || loadingStatus === appt._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(appt._id, "approved");
                          }}
                        >
                          {loadingStatus === appt._id ? "Loading..." : "✓ Approve"}
                        </button>

                        <button
                          className="dr-btn dr-btn-reject"
                          disabled={loadingStatus === appt._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(appt._id, "rejected");
                          }}
                        >
                          {loadingStatus === appt._id ? "Loading..." : "✕ Reject"}
                        </button>
                      </>
                    )}

                    {appt.status === "approved" && (
                      <button
                        className="dr-btn dr-btn-complete"
                        disabled={loadingStatus === appt._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(appt._id, "completed");
                        }}
                      >
                        {loadingStatus === appt._id ? "Loading..." : "✔ Mark Complete"}
                      </button>
                    )}

                    {appt.medicalRecord?.diagnosis ? (
                      <button
                        className="dr-btn dr-btn-record"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApptId(appt._id);
                          setDiagnosis(appt.medicalRecord.diagnosis);
                          setPrescription(appt.medicalRecord.prescription);
                          setNotes(appt.medicalRecord.notes);
                          setShowRecordBox(true);
                        }}
                      >
                        📋 Edit Record
                      </button>
                    ) : (
                      <button
                        className="dr-btn dr-btn-record"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApptId(appt._id);
                          setDiagnosis(""); setPrescription(""); setNotes("");
                          setShowRecordBox(true);
                        }}
                      >
                        📋 Add Record
                      </button>
                    )}

                    {!appt.report && (
                      <button
                        className="dr-btn dr-btn-upload"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApptId(appt._id);
                          setShowUploadBox(true);
                        }}
                      >
                        📎 Upload Report
                      </button>
                    )}

                    {appt.report && (
                      <>
                        <button
                          className="dr-btn dr-btn-view"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewReport(appt._id);
                          }}
                        >
                          👁 View Report
                        </button>
                        <button
                          className="dr-btn dr-btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReport(appt._id);
                          }}
                        >
                          🗑 Delete
                        </button>
                      </>
                    )}

                  </div>
                </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ TIME MODAL ══ */}
      {showTimeBox && (
        <div className="dr-modal-overlay" onClick={() => setShowTimeBox(false)}>
          <div className="dr-modal" onClick={e => e.stopPropagation()}>
            <div className="dr-modal-header">
              <div className="dr-modal-title">Set Visit Time</div>
              <button className="dr-modal-close" onClick={() => setShowTimeBox(false)}>✕</button>
            </div>
            <div className="dr-field">
              <label>Visit Time</label>
              <input
                type="time"
                className="dr-input"
                value={tempTime}
                onChange={e => setTempTime(e.target.value)}
              />
            </div>
            <div className="dr-modal-actions">
              <button className="dr-btn-modal-cancel" onClick={() => setShowTimeBox(false)}>Cancel</button>
              <button
                className="dr-btn-modal-save"
                disabled={!tempTime}
                onClick={() => {
                  setVisitTimes(prev => ({ ...prev, [selectedApptId]: tempTime }));
                  setShowTimeBox(false);
                }}
              >
                Save Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ RECORD MODAL ══ */}
      {showRecordBox && (
        <div className="dr-modal-overlay" onClick={() => setShowRecordBox(false)}>
          <div className="dr-modal" onClick={e => e.stopPropagation()}>
            <div className="dr-modal-header">
              <div className="dr-modal-title">Medical Record</div>
              <button className="dr-modal-close" onClick={() => setShowRecordBox(false)}>✕</button>
            </div>
            <div className="dr-field">
              <label>Diagnosis</label>
              <input className="dr-input" placeholder="Enter diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
            </div>
            <div className="dr-field">
              <label>Prescription</label>
              <input className="dr-input" placeholder="Medications / dosage" value={prescription} onChange={e => setPrescription(e.target.value)} />
            </div>
            <div className="dr-field">
              <label>Clinical Notes</label>
              <textarea className="dr-textarea" placeholder="Additional observations..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="dr-modal-actions">
              <button className="dr-btn-modal-cancel" onClick={() => setShowRecordBox(false)} disabled={loadingRecord}>Cancel</button>
              <button className="dr-btn-modal-save" onClick={saveMedicalRecord} disabled={loadingRecord}>
                {loadingRecord ? "Saving..." : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ UPLOAD MODAL ══ */}
      {showUploadBox && (
        <div className="dr-modal-overlay" onClick={() => setShowUploadBox(false)}>
          <div className="dr-modal" onClick={e => e.stopPropagation()}>
            <div className="dr-modal-header">
              <div className="dr-modal-title">Upload Report</div>
              <button className="dr-modal-close" onClick={() => setShowUploadBox(false)}>✕</button>
            </div>
            <div className="dr-field">
              <label>Report File</label>
              <input type="file" className="dr-input" onChange={e => setReportFile(e.target.files[0])} />
            </div>
            <div className="dr-modal-actions">
              <button className="dr-btn-modal-cancel" onClick={() => setShowUploadBox(false)} disabled={loadingReport}>Cancel</button>
              <button className="dr-btn-modal-save" disabled={!reportFile || loadingReport} onClick={uploadReport}>
                {loadingReport ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DoctorDashboard;