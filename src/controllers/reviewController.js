const Review = require('../models/review');
const Food = require('../models/food');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single review
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a food
exports.getFoodReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ foodId: req.params.foodId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Submit a review
exports.submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const foodId = req.params.foodId;
    const userId = req.user.userId;

    // Check if food exists
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Check if user has already reviewed this food
    const existingReview = await Review.findOne({ foodId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this food' });
    }

    // Create new review
    const review = new Review({
      foodId,
      userId,
      rating: Number(rating),
      comment: comment.trim()
    });

    await review.save();

    // Update food's average rating
    const reviews = await Review.find({ foodId });
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    food.rating = averageRating;
    food.reviewCount = reviews.length;
    await food.save();

    res.status(201).json(review);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user.userId;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    review.rating = Number(rating);
    review.comment = comment.trim();
    await review.save();

    // Update food's average rating
    const foodId = review.foodId;
    const reviews = await Review.find({ foodId });
    const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
    await Food.findByIdAndUpdate(foodId, { rating: averageRating });

    res.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    const foodId = review.foodId;
    await review.deleteOne();

    // Update food's average rating
    const reviews = await Review.find({ foodId });
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;
    await Food.findByIdAndUpdate(foodId, {
      rating: averageRating,
      reviewCount: reviews.length
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
}; 