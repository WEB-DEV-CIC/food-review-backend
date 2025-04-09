const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a review
router.post('/', async (req, res) => {
  const { food_id, user_id, rating, comment } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO reviews (food_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [food_id, user_id, rating, comment]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// Get reviews for a food
router.get('/food/:foodId', async (req, res) => {
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
});