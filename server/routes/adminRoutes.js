// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');


// POST /api/admin/login
router.post('/login', adminController.login);
router.get('/voters', protectAdmin, adminController.getVoters);
router.get('/results', protectAdmin, adminController.getResults);
router.post('/candidates', protectAdmin, adminController.createCandidate);
router.get('/candidates', protectAdmin, adminController.getCandidates);
router.delete('/candidates/:id', protectAdmin, adminController.deleteCandidate);
router.get('/positions', protectAdmin, adminController.getPositions);
router.get('/detailed-results', protectAdmin, adminController.getDetailedResults);
router.post('/voters', protectAdmin, adminController.addVoter);
router.delete('/voters/:id', protectAdmin, adminController.deleteVoter);


module.exports = router;