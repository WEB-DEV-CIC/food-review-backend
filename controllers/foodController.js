const db = require('../db');

// Get all foods with filters
const getAllFoods = async (req, res) => {
  const { region, taste, ingredient } = req.query;
  try {
    let query = `
      SELECT DISTINCT f.*, r.name as region_name,
      array_agg(DISTINCT tp.name) as taste_profiles,
      array_agg(DISTINCT i.name) as ingredients
      FROM foods f
      LEFT JOIN regions r ON f.region_id = r.id
      LEFT JOIN food_taste_profiles ftp ON f.id = ftp.food_id
      LEFT JOIN taste_profiles tp ON ftp.taste_profile_id = tp.id
      LEFT JOIN food_ingredients fi ON f.id = fi.food_id
      LEFT JOIN ingredients i ON fi.ingredient_id = i.id
    `;

    const conditions = [];
    const params = [];

    if (region) {
      params.push(region);
      conditions.push(`r.name = $${params.length}`);
    }
    if (taste) {
      params.push(taste);
      conditions.push(`tp.name = $${params.length}`);
    }
    if (ingredient) {
      params.push(ingredient);
      conditions.push(`i.name = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY f.id, r.name';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

// get food by id
const getFoodById = async (req, res) => {
  const foodId = req.params.id;
  try {
    const result = await db.query('SELECT * FROM foods WHERE id = $1', [foodId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};

module.exports = {
  getAllFoods,
  getFoodById
};