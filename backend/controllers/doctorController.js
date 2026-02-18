const Appointment = require("../models/Appointment");

// GET doctor appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id,
    })
       .select("-report.data")
      .populate("patientId", "fullName email")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

// ✅ UPDATE appointment status (APPROVE / REJECT)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ensure doctor owns this appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment" });
  }
};
// ✅ ADD medical record
exports.addMedicalRecord = async (req, res) => {
  try {
    const { diagnosis, prescription, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ensure doctor owns appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.medicalRecord = {
      diagnosis,
      prescription,
      notes,
      recordedAt: new Date(),
    };

    await appointment.save();

    res.json({
      message: "Medical record saved successfully",
      appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save medical record" });
  }
};
// ✅ UPLOAD REPORT
exports.uploadReport = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ensure doctor owns appointment
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    appointment.report = {
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      data: req.file.buffer,
      uploadedAt: new Date(),
    };

    await appointment.save();

    res.json({ message: "Report uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload report" });
  }
};
// ✅ VIEW REPORT
// ✅ VIEW REPORT (FIXED)
// ✅ VIEW REPORT (FINAL FIX)
exports.viewReport = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment || !appointment.report || !appointment.report.data) {
      return res.status(404).json({ message: "Report not found" });
    }

    // ownership check
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.set({
      "Content-Type": appointment.report.fileType || "application/pdf",
      "Content-Disposition": `inline; filename="${appointment.report.fileName}"`,
      "Content-Length": appointment.report.data.length,
    });

    return res.send(appointment.report.data); // 🔥 THIS LINE
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to view report" });
  }
};


// ✅ DELETE REPORT
exports.deleteReport = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment || !appointment.report?.data) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.report = undefined;
    await appointment.save();

    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete report" });
  }
};

