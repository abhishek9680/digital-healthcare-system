const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  worksAt: { type: String },
  experience: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Admin approval flag. New registrations default to not approved.
  approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
