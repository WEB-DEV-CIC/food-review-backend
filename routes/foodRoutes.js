const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

// Get all foods with filters
router.get('/', foodController.getAllFoods);

// get food by id
router.get('/:id', foodController.getFoodById);

module.exports = router;
