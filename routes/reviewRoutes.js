const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/auth');

// 添加评论 - 需要用户登录
router.post('/', authenticateUser, reviewController.addReview);

// 获取食品评论 - 不需要登录
router.get('/food/:foodId', reviewController.getFoodReviews);

module.exports = router;