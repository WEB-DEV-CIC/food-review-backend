const express = require('express');
const router = express.Router();
const db = require('../db');

// User Registration
router.post('/register', async (req, res) => {
  const { username, fullname, email, password } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (username, fullname, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email',
      [username, fullname, email, password, 'user']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User/Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query(
      'SELECT id, username, role FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});