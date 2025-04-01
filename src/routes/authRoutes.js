const express = require('express');
const router = express.Router();
const { login, register, logout, checkAuth } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

// Protected route to check authentication status
router.get('/check', authenticateToken, checkAuth);

module.exports = router; 