const mongoose = require('mongoose');


const appointmentSchema = new mongoose.Schema({
  doctorEmail: { type: String, required: true },
  patientEmail: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
