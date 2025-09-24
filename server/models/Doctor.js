const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  worksAt: { type: String },
  experience: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add more fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
