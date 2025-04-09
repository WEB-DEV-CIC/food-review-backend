const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';
console.log(`Running in ${isTest ? 'test' : 'development'} mode`);

db.connect(isTest)
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });


if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const foodRoutes = require('./routes/foodRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/foods', foodRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
