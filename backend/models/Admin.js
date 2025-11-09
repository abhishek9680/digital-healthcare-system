const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Optional flag to mark a super admin who can perform sensitive actions
  isSuperAdmin: { type: Boolean, default: false },
  // Additional profile fields
  // designation: { type: String },
  gender: { type: String },
  dob: { type: Date },
  contact: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
