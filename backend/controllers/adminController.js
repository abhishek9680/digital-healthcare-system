const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin'
    }
  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();
    // Return similar response as doctor/patient
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(201).json({
      message: 'Admin registered successfully.',
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    res.status(200).json({ patients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ message: 'Patient deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ message: 'Doctor deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve doctor (set approved = true)
exports.approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndUpdate(id, { $set: { approved: true } }, { new: true }).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.status(200).json({ message: 'Doctor approved', doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reject doctor (delete or mark rejected) - here we delete
exports.rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await Doctor.findByIdAndDelete(id);
    res.status(200).json({ message: 'Doctor rejected and removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending doctor registrations
exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ approved: false }).select('-password');
    res.status(200).json({ doctors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin stats
exports.getStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.countDocuments({});
    const totalPatients = await Patient.countDocuments({});
    const pending = await Doctor.countDocuments({ approved: false });
    res.status(200).json({ totalDoctors, totalPatients, pending });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin profile (protected)
exports.getProfile = async (req, res) => {
  try {
    // adminAuthMiddleware sets req.admin
    const admin = req.admin;
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const { _id, name, email, /*designation,*/ gender, dob, contact, isSuperAdmin } = admin;
    res.status(200).json({ admin: { id: _id, name, email, /*designation,*/ gender, dob, contact, isSuperAdmin, role: 'admin' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin profile (protected)
exports.updateProfile = async (req, res) => {
  try {
    const adminId = req.admin && req.admin._id;
    if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, email, /*designation,*/ gender, dob, contact, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    // if (designation) update.designation = designation;
    if (gender) update.gender = gender;
    if (dob) update.dob = dob;
    if (contact) update.contact = contact;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      update.password = hashed;
    }

    const updated = await Admin.findByIdAndUpdate(adminId, { $set: update }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'Admin not found' });

    const { _id, name: uName, email: uEmail, /*designation: uDesignation,*/ gender: uGender, dob: uDob, contact: uContact, isSuperAdmin } = updated;
    res.status(200).json({ message: 'Profile updated', admin: { id: _id, name: uName, email: uEmail, /*designation: uDesignation,*/ gender: uGender, dob: uDob, contact: uContact, isSuperAdmin, role: 'admin' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
