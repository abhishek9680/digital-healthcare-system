const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorController'); // Adjust path if needed
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Doctor routes
router.post('/api/doctors/register', doctorController.register);
router.post('/api/doctors/login', doctorController.login);

// Protected routes (require authentication)
router.put('/api/doctors/update', authMiddleware, doctorController.updateDoctor);

// Appointment routes
router.get('/api/appointments/doctor', authMiddleware, doctorController.getAppointmentsForDoctor);
router.get('/api/appointments/booked', authMiddleware, doctorController.getBookedAppointments);

// Update appointment status (accept/reject)
router.patch('/api/appointments/:appointmentId/status', authMiddleware, doctorController.updateAppointmentStatus);

module.exports = router;
