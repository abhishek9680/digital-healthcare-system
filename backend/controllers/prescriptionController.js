const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

// Create a prescription linked to an appointment
exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, additionalNotes } = req.body;
    if (!appointmentId || !Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({ message: 'appointmentId and medicines are required' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Ensure the caller is a doctor and matches the appointment's doctor email
    if (!req.user || req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create prescriptions' });
    }

    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    if (doctor.email !== appointment.doctorEmail) {
      return res.status(403).json({ message: 'You are not the doctor for this appointment' });
    }

    // Try to locate patient id from email
    const patient = await Patient.findOne({ email: appointment.patientEmail });

    const prescription = new Prescription({
      appointmentId,
      doctorId: doctor._id,
      doctorEmail: doctor.email,
      patientId: patient?._id,
      patientEmail: appointment.patientEmail,
      medicines,
      additionalNotes,
    });

    await prescription.save();
    return res.status(201).json({ message: 'Prescription created', prescription });
  } catch (err) {
    console.error('createPrescription', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get prescriptions by patient id
exports.getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) return res.status(400).json({ message: 'patientId is required' });

    // Only allow patient themselves, or doctors/admins
    if (req.user.role === 'patient' && req.user.id !== patientId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const prescriptions = await Prescription.find({ patientEmail: patient.email }).sort({ createdAt: -1 });
    return res.json({ prescriptions });
  } catch (err) {
    console.error('getPrescriptionsByPatient', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get prescription(s) for an appointment
exports.getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) return res.status(400).json({ message: 'appointmentId is required' });

    const prescription = await Prescription.findOne({ appointmentId });
    if (!prescription) return res.status(404).json({ message: 'Prescription not found for this appointment' });

    // Only allow related patient, the doctor, or admin
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ email: prescription.patientEmail });
      if (!patient || patient._id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    if (req.user.role === 'doctor') {
      if (prescription.doctorId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    return res.json({ prescription });
  } catch (err) {
    console.error('getPrescriptionByAppointment', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get prescriptions for the logged-in doctor
exports.getPrescriptionsByDoctor = async (req, res) => {
  try {
    // Only doctors or admins can list prescriptions by doctor
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // If admin requested and provided a doctorId param, allow (optional)
    let doctorId = req.user.id;
    if (req.user.role === 'admin' && req.query.doctorId) {
      doctorId = req.query.doctorId;
    }

    if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const prescriptions = await Prescription.find({ doctorId }).sort({ createdAt: -1 });
    return res.json({ prescriptions });
  } catch (err) {
    console.error('getPrescriptionsByDoctor', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
