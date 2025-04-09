const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// === FOOD MANAGEMENT ===
router.post('/foods', adminController.addFood);
router.put('/foods/:id', adminController.updateFood);
router.delete('/foods/:id', adminController.deleteFood);

// === REVIEW MANAGEMENT ===
router.delete('/reviews/:id', adminController.deleteReview);

// === USER MANAGEMENT ===
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;