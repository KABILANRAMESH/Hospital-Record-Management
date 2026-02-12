const Appointment = require("../models/Appointment");

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate } = req.body;

    if (!doctorId || !appointmentDate) {
      return res.status(400).json({ message: "Missing data" });
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,   // from JWT
      doctorId,
      appointmentDate,
      status: "pending",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};
