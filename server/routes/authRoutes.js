// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define the POST route for login
// URL will be: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;