const express = require('express');
const router = express.Router();
const Food = require('../models/food');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/user');

// Get all foods with optional filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, cuisine } = req.query;
    const query = {};

    // Add search filter if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Add cuisine filter if provided
    if (cuisine) {
      query.cuisine = cuisine;
    }

    const foods = await Food.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Food.countDocuments(query);

    res.json({
      foods,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Error fetching foods' });
  }
});

// Get featured foods
router.get('/featured', async (req, res) => {
  try {
    const featuredFoods = await Food.find({ isFeatured: true })
      .sort({ rating: -1 })
      .limit(6);
    res.json(featuredFoods);
  } catch (error) {
    console.error('Error fetching featured foods:', error);
    res.status(500).json({ message: 'Error fetching featured foods' });
  }
});

// Get available cuisines
router.get('/cuisines', async (req, res) => {
  try {
    const cuisines = await Food.distinct('cuisine');
    res.json(cuisines);
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    res.status(500).json({ message: 'Error fetching cuisines' });
  }
});

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ message: 'Error fetching food' });
  }
});

// Get reviews for a food
router.get('/:id/reviews', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    
    // Populate user information for each review
    const reviews = await Promise.all(food.reviews.map(async (review) => {
      const user = await User.findById(review.userId).select('name');
      return {
        ...review.toObject(),
        userName: user ? user.name : 'Anonymous'
      };
    }));
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Submit a review for a food
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    // Initialize reviews array if it doesn't exist
    if (!food.reviews) {
      food.reviews = [];
    }

    const review = {
      userId: req.user.userId,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
    };

    food.reviews.push(review);
    
    // Update average rating and review count
    const totalRating = food.reviews.reduce((sum, review) => sum + review.rating, 0);
    food.rating = totalRating / food.reviews.length;
    food.reviewCount = food.reviews.length;
    
    await food.save();

    // Get user information for the new review
    const user = await User.findById(review.userId).select('name');
    
    // Return all reviews with user information
    const reviews = await Promise.all(food.reviews.map(async (review) => {
      const user = await User.findById(review.userId).select('name');
      return {
        ...review.toObject(),
        userName: user ? user.name : 'Anonymous'
      };
    }));
    
    res.status(201).json(reviews);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

module.exports = router; 