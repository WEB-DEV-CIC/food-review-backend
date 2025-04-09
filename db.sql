-- Create user role enum type
CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  fullname VARCHAR(100) NOT NULL,  
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  
  role user_role DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE taste_profiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  region_id INTEGER REFERENCES regions(id),
  image_url TEXT, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_ingredients (
  food_id INTEGER REFERENCES foods(id) ON DELETE CASCADE,
  ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
  PRIMARY KEY (food_id, ingredient_id)
);

CREATE TABLE food_taste_profiles (
  food_id INTEGER REFERENCES foods(id) ON DELETE CASCADE,
  taste_profile_id INTEGER REFERENCES taste_profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (food_id, taste_profile_id)
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  food_id INTEGER REFERENCES foods(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
