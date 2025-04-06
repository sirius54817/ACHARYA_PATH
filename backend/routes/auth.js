const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user
router.get('/user', authController.getUser);

// Set user as admin (protected)
router.put('/set-admin/:userId', authMiddleware, authController.setAdmin);

module.exports = router; 