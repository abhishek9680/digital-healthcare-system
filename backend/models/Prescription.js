const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String },
  instructions: { type: String },
});

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  doctorEmail: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  patientEmail: { type: String, required: true },
  medicines: [medicineSchema],
  additionalNotes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
