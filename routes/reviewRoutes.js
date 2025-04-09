const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Add a review
router.post('/', reviewController.addReview);

// Get reviews for a food
router.get('/food/:foodId', reviewController.getFoodReviews);

module.exports = router;