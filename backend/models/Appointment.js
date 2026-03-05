const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },
    visitTime: {
  type: String,
},

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },

    // ✅ ADD THIS 👇
    medicalRecord: {
      diagnosis: {
        type: String,
        default: "",
      },
      prescription: {
        type: String,
        default: "",
      },
      notes: {
        type: String,
        default: "",
      },
      recordedAt: {
        type: Date,
        default: Date.now,
      },
    },
    report: {
  fileName: String,
  fileType: String,
  data: Buffer,
  uploadedAt: Date,
}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
