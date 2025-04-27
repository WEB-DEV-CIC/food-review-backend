const db = require('../db');

// === FOOD MANAGEMENT ===
const addFood = async (req, res) => {
  const { name, description, region_id, image_url, ingredients, taste_profiles } = req.body;
  
  try {
    // 开始数据库事务
    await db.query('BEGIN');

    // 1. 插入食物基本信息
    const foodResult = await db.query(
      'INSERT INTO foods (name, description, region_id, image_url) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, description, region_id, image_url]
    );
    const foodId = foodResult.rows[0].id;

    // 2. 处理原料
    for (const ingredientName of ingredients) {
      // 查找或创建原料
      const ingredientResult = await db.query(
        'INSERT INTO ingredients (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
        [ingredientName]
      );
      const ingredientId = ingredientResult.rows[0].id;
      
      // 关联食物和原料
      await db.query(
        'INSERT INTO food_ingredients (food_id, ingredient_id) VALUES ($1, $2)',
        [foodId, ingredientId]
      );
    }

    // 3. 处理口味特征
    for (const profileName of taste_profiles) {
      // 查找或创建口味特征
      const profileResult = await db.query(
        'INSERT INTO taste_profiles (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
        [profileName]
      );
      const profileId = profileResult.rows[0].id;
      
      // 关联食物和口味特征
      await db.query(
        'INSERT INTO food_taste_profiles (food_id, taste_profile_id) VALUES ($1, $2)',
        [foodId, profileId]
      );
    }

    // 提交事务
    await db.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Food added successfully',
      food_id: foodId
    });

  } catch (error) {
    // 回滚事务
    await db.query('ROLLBACK');
    console.error('Error adding food:', error);
    res.status(500).json({ 
      error: 'Failed to add food', 
      details: error.message 
    });
  }
};

const updateFood = async (req, res) => {
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
};

const deleteFood = async (req, res) => {
  try {
    const foodId = parseInt(req.params.id);
    if (isNaN(foodId)) {
      return res.status(400).json({ error: 'Invalid food ID' });
    }

    // 首先检查食物是否存在
    const checkResult = await db.query('SELECT id FROM foods WHERE id = $1', [foodId]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }

    // 删除相关的记录（使用事务确保数据一致性）
    await db.query('BEGIN');
    try {
      // 删除食物的配料关联
      await db.query('DELETE FROM food_ingredients WHERE food_id = $1', [foodId]);
      // 删除食物的口味特征关联
      await db.query('DELETE FROM food_taste_profiles WHERE food_id = $1', [foodId]);
      // 删除食物的评论
      await db.query('DELETE FROM reviews WHERE food_id = $1', [foodId]);
      // 最后删除食物本身
      await db.query('DELETE FROM foods WHERE id = $1', [foodId]);
      
      await db.query('COMMIT');
      res.json({ message: 'Food deleted successfully' });
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  } catch (err) {
    console.error('Error deleting food:', err);
    res.status(500).json({ error: 'Failed to delete food', details: err.message });
  }
};

// Get all foods (admin version with additional details)
const getAllFoods = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT f.*, r.name as region_name,
        array_agg(DISTINCT tp.name) as taste_profiles,
        array_agg(DISTINCT i.name) as ingredients,
        COUNT(DISTINCT rv.id) as review_count,
        COALESCE(AVG(rv.rating), 0) as rating
      FROM foods f
      LEFT JOIN regions r ON f.region_id = r.id
      LEFT JOIN food_taste_profiles ftp ON f.id = ftp.food_id
      LEFT JOIN taste_profiles tp ON ftp.taste_profile_id = tp.id
      LEFT JOIN food_ingredients fi ON f.id = fi.food_id
      LEFT JOIN ingredients i ON fi.ingredient_id = i.id
      LEFT JOIN reviews rv ON f.id = rv.food_id
      GROUP BY f.id, r.name
      ORDER BY f.id
    `);
    
    // Transform the result to match frontend expectations
    const foods = result.rows.map(food => ({
      _id: food.id.toString(),
      id: food.id,
      name: food.name,
      description: food.description,
      region: food.region_name,
      image: food.image_url,
      rating: parseFloat(food.rating).toFixed(1),
      reviewCount: parseInt(food.review_count),
      tasteProfile: food.taste_profiles.filter(tp => tp !== null),
      ingredients: food.ingredients.filter(i => i !== null),
      cuisine: food.region_name // For backward compatibility
    }));
    
    res.json(foods);
  } catch (err) {
    console.error('Error fetching admin foods:', err);
    res.status(500).json({ error: 'Failed to fetch foods', details: err.message });
  }
};

// === REVIEW MANAGEMENT ===
const deleteReview = async (req, res) => {
  try {
    await db.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

// === USER MANAGEMENT ===
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, fullname, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const createUser = async (req, res) => {
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
};

const updateUser = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// === STATISTICS ===
const getStats = async (req, res) => {
  try {
    // Get total foods count
    const foodsResult = await db.query('SELECT COUNT(*) as count FROM foods');
    const totalFoods = parseInt(foodsResult.rows[0].count);
    
    // Get total reviews count
    const reviewsResult = await db.query('SELECT COUNT(*) as count FROM reviews');
    const totalReviews = parseInt(reviewsResult.rows[0].count);
    
    // Get average rating 
    const avgRatingResult = await db.query('SELECT AVG(rating) as avg_rating FROM reviews');
    const avgRating = parseFloat(avgRatingResult.rows[0].avg_rating) || 0;
    
    // Return the statistics
    res.json({
      stats: {
        totalFoods,
        totalReviews,
        avgRating: Math.round(avgRating * 10) / 10 // Round to 1 decimal place
      }
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};

module.exports = {
  // Food management
  getAllFoods,
  addFood,
  updateFood,
  deleteFood,
  
  // Review management
  deleteReview,
  
  // User management
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  
  // Statistics
  getStats
};