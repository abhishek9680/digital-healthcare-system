const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patientController');

const patientAuthMiddleware = require('../middleware/authMiddleware'); // Reuse or create patient-specific middleware if needed



// Getting patient profile (protected)
router.get('/api/patients/profile', patientAuthMiddleware, patientController.getProfile);

// Get all appointments for a patient (protected)
router.get('/api/patients/appointments', patientAuthMiddleware, patientController.getAppointmentsForPatient);

// Patient registration & login
router.post('/api/patients/register', patientController.register);
router.post('/api/patients/login', patientController.login);





// Book appointment (by patient)
router.post('/api/appointments/book', patientController.bookAppointment);


// Update patient profile (protected)
router.put('/api/patients/update', patientAuthMiddleware, patientController.updatePatient);

module.exports = router;

