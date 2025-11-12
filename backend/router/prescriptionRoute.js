const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middleware/authMiddleware');

// Create prescription (doctor only)
router.post('/api/prescriptions', authMiddleware, prescriptionController.createPrescription);

// Get prescriptions for a patient (patient can view own, doctors/admins can view)
router.get('/api/prescriptions/patient/:patientId', authMiddleware, prescriptionController.getPrescriptionsByPatient);

// Get prescription for an appointment
router.get('/api/prescriptions/appointment/:appointmentId', authMiddleware, prescriptionController.getPrescriptionByAppointment);

// Get prescriptions for the logged-in doctor
router.get('/api/prescriptions/doctor', authMiddleware, prescriptionController.getPrescriptionsByDoctor);

module.exports = router;
