const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date},
  gender: { type: String, enum: ['Male', 'Female', 'Other']},
  medicalHistory: { type: String },
  address: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
