const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorController'); // Adjust path if needed
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Doctor routes
router.post('/api/doctors/register', doctorController.register);
router.post('/api/doctors/login', doctorController.login);

// Get all doctors (unprotected)
router.get('/api/doctors/all', doctorController.getAllDoctors);

// Protected routes (require authentication)
router.put('/api/doctors/update', authMiddleware, doctorController.updateDoctor);

// Appointment routes for doctor
router.get('/api/appointments/doctor', authMiddleware, doctorController.getAppointmentsForDoctor);
router.get('/api/appointments/booked', authMiddleware, doctorController.getBookedAppointments);

// Get booked slots for a doctor on a date (public)
router.get('/api/appointments/slots', doctorController.getBookedSlots);

// Update appointment status (accept/reject)
router.patch('/api/appointments/:appointmentId/status', authMiddleware, doctorController.updateAppointmentStatus);

// Doctor dashboard routes
router.get('/api/doctors/profile', authMiddleware, doctorController.getProfile);

// Get approved patients for current doctor
router.get('/api/doctors/patients', authMiddleware, doctorController.getApprovedPatients);

module.exports = router;
