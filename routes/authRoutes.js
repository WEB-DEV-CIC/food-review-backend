const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const db = require('../db'); // Assuming a database module is required

// User Registration
router.post('/register', authController.register);

// User/Admin Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password: '******' });
  
  try {
    const result = await db.query(
      'SELECT id, username, fullname, email, role FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    console.log('Query result:', result.rows);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // 确保用户对象包含所有必要字段，并转换字段名以匹配前端期望
      const userData = {
        id: user.id,
        name: user.username || user.fullname, // 提供合适的name字段
        email: user.email,
        role: user.role || 'user' 
      };
      
      // 生成令牌（如果有JWT实现）
      const token = "your-jwt-token-generation-logic";
      
      res.json({
        success: true,
        user: userData,
        token: token
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed due to server error' });
  }
});

// Logout
router.post('/logout', authController.logout);

module.exports = router;