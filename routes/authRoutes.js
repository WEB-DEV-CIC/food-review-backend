const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User Registration
router.post('/register', authController.register);

// User/Admin Login
router.post('/login', authController.login);

// Logout
router.post('/logout', authController.logout);

module.exports = router;