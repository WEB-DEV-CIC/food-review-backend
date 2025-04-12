const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Food = require('../models/food');
const Review = require('../models/review');
const User = require('../models/User');

// Get all foods (admin only)
router.get('/foods', protect, admin, async (req, res) => {
    try {
        const foods = await Food.find().populate('reviews');
        res.json(foods);
    } catch (error) {
        console.error('Error fetching foods:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update food (admin only)
router.put('/foods/:id', protect, admin, async (req, res) => {
    try {
        const { name, cuisine, description, price, image } = req.body;
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }

        food.name = name || food.name;
        food.cuisine = cuisine || food.cuisine;
        food.description = description || food.description;
        food.price = price || food.price;
        food.image = image || food.image;

        await food.save();
        res.json(food);
    } catch (error) {
        console.error('Error updating food:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete food (admin only)
router.delete('/foods/:id', protect, admin, async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({ error: 'Food not found' });
        }

        // Delete associated reviews
        await Review.deleteMany({ food: req.params.id });

        // Delete the food
        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: 'Food deleted successfully' });
    } catch (error) {
        console.error('Error deleting food:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all reviews (admin only)
router.get('/reviews', protect, admin, async (req, res) => {
    try {
        const reviews = await Review.find().populate('user food');
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete review (admin only)
router.delete('/reviews/:id', protect, admin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Remove review reference from food
        const food = await Food.findById(review.food);
        if (food) {
            food.reviews = food.reviews.filter(r => r.toString() !== req.params.id);
            await food.save();
        }

        // Delete the review
        await review.remove();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get dashboard statistics (admin only)
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalFoods,
            totalReviews,
            recentReviews
        ] = await Promise.all([
            User.countDocuments(),
            Food.countDocuments(),
            Review.countDocuments(),
            Review.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user food')
        ]);

        res.json({
            stats: {
                totalUsers,
                totalFoods,
                totalReviews,
                recentReviews
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router; 