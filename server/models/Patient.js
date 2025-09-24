const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  medicalHistory: { type: String },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
