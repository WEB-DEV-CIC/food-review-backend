const db = require('../db');

// User Registration
const register = async (req, res) => {
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
};

// User/Admin Login 
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query(
      'SELECT id, username, role FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  logout
};