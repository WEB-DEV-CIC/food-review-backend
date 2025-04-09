const express = require('express');
const router = express.Router();
const db = require('../db');

// Add new food
router.post('/foods', async (req, res) => {
  const { name, description, region_id, image_url, ingredients, taste_profiles } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO foods (name, description, region_id, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, region_id, image_url]
    );
    const foodId = result.rows[0].id;
    
    // Add ingredients
    for (let ingredient_id of ingredients) {
      await db.query(
        'INSERT INTO food_ingredients (food_id, ingredient_id) VALUES ($1, $2)',
        [foodId, ingredient_id]
      );
    }
    
    // Add taste profiles
    for (let profile_id of taste_profiles) {
      await db.query(
        'INSERT INTO food_taste_profiles (food_id, taste_profile_id) VALUES ($1, $2)',
        [foodId, profile_id]
      );
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add food' });
  }
});

// Update food
router.put('/foods/:id', async (req, res) => {
  const { name, description, region_id, image_url } = req.body;
  try {
    const result = await db.query(
      'UPDATE foods SET name = $1, description = $2, region_id = $3, image_url = $4 WHERE id = $5 RETURNING *',
      [name, description, region_id, image_url, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update food' });
  }
});

// Delete food
router.delete('/foods/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM foods WHERE id = $1', [req.params.id]);
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete food' });
  }
});

//add new reviews
router.delete('/reviews/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// get all users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, fullname, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// create new user
router.post('/users', async (req, res) => {
  const { username, fullname, email, password, role } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (username, fullname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [username, fullname, email, password, role]
    );
    res.status(201).json({ id: result.rows[0].id, message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// update user
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;
  try {
    await db.query(
      'UPDATE users SET username = $1, email = $2, role = $3 WHERE id = $4',
      [username, email, role, id]
    );
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// delete user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

