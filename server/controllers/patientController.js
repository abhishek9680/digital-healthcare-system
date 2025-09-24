const Patient = require('../models/Patient');

// Get patient by email
async function getPatientByEmail(email) {
  return await Patient.findOne({ email });
}

// Create new patient
async function createPatient(data) {
  const patient = new Patient(data);
  return await patient.save();
}

// Update patient by email
async function updatePatientByEmail(email, update) {
  return await Patient.findOneAndUpdate({ email }, update, { new: true });
}

module.exports = {
  getPatientByEmail,
  createPatient,
  updatePatientByEmail,
};
