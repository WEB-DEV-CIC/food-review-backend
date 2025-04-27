const db = require('../db');

// Add a review
const addReview = async (req, res) => {
  try {
    const { food_id, user_id, rating, comment } = req.body;
    
    // 验证评论参数
    if (!food_id || !user_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // 验证评分范围
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // 插入评论
    const result = await db.query(
      'INSERT INTO reviews (food_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [food_id, user_id, rating, comment]
    );
    
    // 返回新创建的评论及相关用户信息
    const review = result.rows[0];
    const userResult = await db.query('SELECT username FROM users WHERE id = $1', [user_id]);
    
    if (userResult.rows.length > 0) {
      review.username = userResult.rows[0].username;
    }
    
    res.status(201).json(review);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// Get reviews for a food (不需要修改)
const getFoodReviews = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, u.username 
       FROM reviews r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.food_id = $1`,
      [req.params.foodId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

module.exports = {
  addReview,
  getFoodReviews
};