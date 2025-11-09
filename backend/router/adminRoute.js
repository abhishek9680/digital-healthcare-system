const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuthMiddleware');

// Admin login
router.post('/api/admin/login', adminController.login);

// Admin register
router.post('/api/admin/register', adminController.register);

// Admin profile endpoints
router.get('/api/admin/profile', adminAuth, adminController.getProfile);
router.put('/api/admin/profile', adminAuth, adminController.updateProfile);

// Protected admin routes
router.get('/api/admin/patients', adminAuth, adminController.getAllPatients);
router.delete('/api/admin/patients/:id', adminAuth, adminController.deletePatient);
router.delete('/api/admin/doctors/:id', adminAuth, adminController.deleteDoctor);
router.put('/api/admin/doctors/:id/approve', adminAuth, adminController.approveDoctor);
router.put('/api/admin/doctors/:id/reject', adminAuth, adminController.rejectDoctor);
router.get('/api/admin/doctors/pending', adminAuth, adminController.getPendingDoctors);
router.get('/api/admin/stats', adminAuth, adminController.getStats);

module.exports = router;
