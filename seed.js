const { Pool } = require('pg');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';
const dbName = isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME;

console.log(`Seeding database: ${dbName}`);

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: dbName,
  port: process.env.DB_PORT
});

// Add sample users data
const sampleUsers = [
  {
    username: 'admin',
    fullname: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'testuser1',
    fullname: 'Test User 1',
    email: 'testuser1@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    username: 'testuser2',
    fullname: 'Test User 2',
    email: 'testuser2@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    username: 'testuser3',
    fullname: 'Test User 3',
    email: 'testuser3@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    username: 'testuser4',
    fullname: 'Test User 4',
    email: 'testuser4@example.com',
    password: 'user123',
    role: 'user'
  }
];

const sampleFoods = [
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil',
    region: 'Europe',
    image_url: 'https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Dairy', 'Grain', 'Vegetable'],
    taste_profiles: ['Salty', 'Sweet'],
    reviews: [
      {
        username: 'testuser1',
        rating: 5,
        comment: 'Best pizza I\'ve ever had! The fresh basil makes all the difference.'
      },
      {
        username: 'testuser2',
        rating: 4,
        comment: 'Really authentic Italian taste, though I prefer it a bit more crispy.'
      },
      {
        username: 'testuser3',
        rating: 5,
        comment: 'Perfect balance of cheese and tomato sauce.'
      }
    ]
  },
  {
    name: 'Sushi',
    description: 'Fresh salmon and avocado roll with premium sushi rice',
    region: 'Asia',
    image_url: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Seafood', 'Grain', 'Vegetable'],
    taste_profiles: ['Salty', 'Sour'],
    reviews: [
      {
        username: 'testuser2',
        rating: 5,
        comment: 'The freshness of the salmon is outstanding!'
      },
      {
        username: 'testuser3',
        rating: 4,
        comment: 'Great combination of flavors, though rice could be a bit firmer.'
      },
      {
        username: 'testuser4',
        rating: 5,
        comment: 'Perfect balance of fish and rice. Authentic taste!'
      }
    ]
  },
  {
    name: 'Butter Chicken',
    description: 'Tender chicken in rich, creamy tomato sauce with Indian spices',
    region: 'Asia',
    image_url: 'https://images.pexels.com/photos/9738981/pexels-photo-9738981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Meat', 'Dairy', 'Spice/Flavoring'],
    taste_profiles: ['Spicy', 'Sweet'],
    reviews: [
      {
        username: 'testuser1',
        rating: 4,
        comment: 'Rich and creamy sauce, perfectly spiced!'
      },
      {
        username: 'testuser4',
        rating: 5,
        comment: 'The chicken is so tender and the gravy is amazing.'
      },
      {
        username: 'testuser2',
        rating: 4,
        comment: 'Authentic Indian flavors, though could be a bit spicier.'
      }
    ]
  },
  {
    name: 'Beef Tacos',
    description: 'Mexican street tacos with seasoned beef, onions, and cilantro',
    region: 'North America',
    image_url: 'https://images.pexels.com/photos/7613555/pexels-photo-7613555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Meat', 'Vegetable', 'Spice/Flavoring'],
    taste_profiles: ['Spicy', 'Salty'],
    reviews: [
      {
        username: 'testuser3',
        rating: 5,
        comment: 'These tacos are as authentic as they come!'
      },
      {
        username: 'testuser1',
        rating: 4,
        comment: 'Love the seasoning on the beef. Fresh ingredients!'
      },
      {
        username: 'testuser4',
        rating: 5,
        comment: 'Perfect street food, reminds me of Mexico City.'
      }
    ]
  },
  {
    name: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta, olives, and olive oil',
    region: 'Europe',
    image_url: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Vegetable', 'Dairy', 'Spice/Flavoring'],
    taste_profiles: ['Salty', 'Sour'],
    reviews: [
      {
        username: 'testuser2',
        rating: 5,
        comment: 'So fresh and light! The feta cheese is perfect.'
      },
      {
        username: 'testuser4',
        rating: 4,
        comment: 'Great Mediterranean flavors, love the olives.'
      },
      {
        username: 'testuser1',
        rating: 5,
        comment: 'Simple but delicious! High quality ingredients.'
      }
    ]
  },
  {
    name: 'Peking Duck',
    description: 'Crispy duck with thin pancakes, hoisin sauce, and scallions',
    region: 'Asia',
    image_url: 'https://images.pexels.com/photos/5848595/pexels-photo-5848595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Meat', 'Grain', 'Spice/Flavoring'],
    taste_profiles: ['Sweet', 'Salty'],
    reviews: [
      {
        username: 'testuser3',
        rating: 5,
        comment: 'The skin is perfectly crispy! Amazing flavor.'
      },
      {
        username: 'testuser1',
        rating: 4,
        comment: 'Love the combination with hoisin sauce.'
      },
      {
        username: 'testuser2',
        rating: 5,
        comment: 'Best Peking duck outside of Beijing!'
      }
    ]
  },
  {
    name: 'Fish and Chips',
    description: 'Classic British battered fish with crispy chips',
    region: 'Europe',
    image_url: 'https://images.pexels.com/photos/1123250/pexels-photo-1123250.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Seafood', 'Grain', 'Vegetable'],
    taste_profiles: ['Salty'],
    reviews: [
      {
        username: 'testuser4',
        rating: 4,
        comment: 'Crispy batter and flaky fish. Classic!'
      },
      {
        username: 'testuser2',
        rating: 5,
        comment: 'The chips are perfectly crispy on the outside.'
      },
      {
        username: 'testuser3',
        rating: 4,
        comment: 'Good portion size and very fresh fish.'
      }
    ]
  },
  {
    name: 'Pho',
    description: 'Vietnamese noodle soup with beef and fresh herbs',
    region: 'Asia',
    image_url: 'https://images.pexels.com/photos/1265626/pexels-photo-1265626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Meat', 'Grain', 'Spice/Flavoring'],
    taste_profiles: ['Salty', 'Spicy'],
    reviews: [
      {
        username: 'testuser1',
        rating: 5,
        comment: 'The broth is so rich and flavorful!'
      },
      {
        username: 'testuser4',
        rating: 4,
        comment: 'Love the fresh herbs and tender beef.'
      },
      {
        username: 'testuser3',
        rating: 5,
        comment: 'Perfect comfort food, especially on cold days.'
      }
    ]
  },
  {
    name: 'Lamington',
    description: 'TA classic Australian dessert consisting of sponge cake squares coated in a layer of chocolate sauce and rolled in desiccated coconut. Sometimes filled with cream or jam, lamingtons are a beloved treat at schools, fundraisers, and afternoon teas.',
    region: 'Oceania',
    image_url: 'https://images.pexels.com/photos/6441615/pexels-photo-6441615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ingredients: ['Grain', 'Fruit', 'Dairy'],
    taste_profiles: ['Sweet'],
    reviews: [
      {
        username: 'testuser2',
        rating: 5,
        comment: 'Sweet! ^-^ !'
      },
      {
        username: 'testuser3',
        rating: 4,
        comment: 'Love the coconut milk drizzle.'
      },
      {
        username: 'testuser1',
        rating: 5,
        comment: 'Best dessert ever! So refreshing.'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Seed users first
    for (const user of sampleUsers) {
      await pool.query(`
        INSERT INTO users (username, fullname, email, password, role) 
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (username) DO NOTHING
      `, [user.username,user.fullname, user.email, user.password, user.role]);
    }

    // Seed regions
    await pool.query(`
      INSERT INTO regions (name) VALUES 
      ('Asia'), ('Europe'), ('Africa'), ('North America'),
      ('South America'), ('Middle East'), ('Oceania')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Seed taste profiles
    await pool.query(`
      INSERT INTO taste_profiles (name) VALUES 
      ('Sweet'), ('Spicy'), ('Sour'), ('Salty'), ('Bitter')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Updated ingredients
    await pool.query(`
      INSERT INTO ingredients (name) VALUES 
      ('Meat'), ('Seafood'), ('Dairy'), ('Grain'),
      ('Vegetable'), ('Fruit'), ('Spice/Flavoring')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Seed sample foods
    for (const food of sampleFoods) {
      try {
        // 检查食物是否已存在
        const { rows: existingFoods } = await pool.query(
          'SELECT id FROM foods WHERE name = $1',
          [food.name]
        );
        
        let foodId;
        
        if (existingFoods.length === 0) {
          // 插入新食物
          const { rows: [{ id: newFoodId }] } = await pool.query(
            'INSERT INTO foods (name, description, region_id, image_url) VALUES ($1, $2, (SELECT id FROM regions WHERE name = $3), $4) RETURNING id',
            [food.name, food.description, food.region, food.image_url]
          );
          foodId = newFoodId;
        } else {
          foodId = existingFoods[0].id;
        }

        // Add ingredients
        for (const ingredient of food.ingredients) {
          await pool.query(`
            INSERT INTO food_ingredients (food_id, ingredient_id)
            SELECT $1, id FROM ingredients WHERE name = $2`,
            [foodId, ingredient]
          );
        }

        // Add taste profiles
        for (const taste of food.taste_profiles) {
          await pool.query(`
            INSERT INTO food_taste_profiles (food_id, taste_profile_id)
            SELECT $1, id FROM taste_profiles WHERE name = $2`,
            [foodId, taste]
          );
        }

        // Add reviews if they exist
        if (food.reviews) {
          for (const review of food.reviews) {
            const { rows: [user] } = await pool.query(
              'SELECT id FROM users WHERE username = $1',
              [review.username]
            );

            await pool.query(`
              INSERT INTO reviews (food_id, user_id, rating, comment)
              VALUES ($1, $2, $3, $4)
              ON CONFLICT DO NOTHING
            `, [foodId, user.id, review.rating, review.comment]);
          }
        }
      } catch (error) {
        console.error(`Error seeding food: ${food.name}`, error);
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
};

seedDatabase();