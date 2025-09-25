const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentDate: { type: Date, required: true },
  status: { type: String, default: 'booked' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
