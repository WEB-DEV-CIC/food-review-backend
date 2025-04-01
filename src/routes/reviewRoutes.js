const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReview,
  getFoodReviews,
  submitReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

// Get all reviews
router.get('/', getAllReviews);

// Get single review
router.get('/:id', getReview);

// Get reviews for a food item
router.get('/foods/:foodId/reviews', getFoodReviews);

// Submit a review
router.post('/foods/:foodId/reviews', authenticateToken, submitReview);

// Update a review
router.put('/reviews/:id', authenticateToken, updateReview);

// Delete a review
router.delete('/reviews/:id', authenticateToken, deleteReview);

module.exports = router; 