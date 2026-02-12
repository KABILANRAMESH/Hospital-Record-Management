const Appointment = require("../models/Appointment");

// GET doctor appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id,
    })
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
