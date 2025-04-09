# Seed.js Guide - Food Review Backend

## Overview
`seed.js` is a database seeding utility that populates the PostgreSQL database with initial sample data for the Food Review application. This includes users, foods, reviews, regions, ingredients, and taste profiles.

## Prerequisites
- Node.js installed
- PostgreSQL server running
- Database `food_review_cql` created
- Database schema initialized (using `db.sql`)
- `.env` file properly configured

## Environment Setup
Create a `.env` file in the project root with:
```
PORT=3002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123
DB_PORT=5432

# main database
DB_NAME=food_review_cql

# test database
TEST_DB_NAME=food_review_test
```

## Sample Data Contents

### Users (5 total)
- 1 admin user
- 4 regular users with test credentials

### Foods (9 items)
- Margherita Pizza
- Sushi Roll
- Butter Chicken
- Beef Tacos
- Greek Salad
- Peking Duck
- Fish and Chips
- Pho
- Mango Sticky Rice

### Supporting Data
- 7 regions (Asia, Europe, etc.)
- 5 taste profiles (Sweet, Spicy, etc.)
- 7 ingredient categories
- 27 reviews (3 per food item)

## Usage Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup Verification
Using pgAdmin4:
1. Verify database exists
2. Confirm tables are created
3. Check database connection

# creat main database
createdb food_review_cql

# create test database
createdb food_review_test

# initial database structure
psql -d food_review_cql -f db.sql

### 3. Run Seed Script
```bash
npm run seed

npm run seed-test
```

### 4. Verify Success
You should see:
```
Database seeded successfully!
```

## Data Verification Queries
Run these in pgAdmin4 to verify data:

```sql
-- Check users
SELECT * FROM users;

-- Check foods
SELECT * FROM foods;

-- Check reviews
SELECT COUNT(*) FROM reviews;
```

## Error Handling

### Common Issues & Solutions

1. **Connection Error**
   ```
   Error: connect ECONNREFUSED
   ```
   - Check PostgreSQL service is running
   - Verify `.env` credentials

2. **Table Not Found**
   ```
   Error: relation "table_name" does not exist
   ```
   - Run `db.sql` first
   - Check database schema

3. **Duplicate Entry**
   - Safe to ignore (handled automatically)
   - Uses `ON CONFLICT DO NOTHING`

## Reset Data

To clear and reseed:

```sql
TRUNCATE users, foods, reviews, 
food_ingredients, food_taste_profiles CASCADE;
```

Then run:
```bash
node seed.js
```

## Security Notes

- Default passwords are for development only
- Change credentials before production use
- Seed script is not for production environments

## Support

For issues:
1. Check console error messages
2. Verify database connection
3. Ensure PostgreSQL service is running
4. Check file permissions

## Schema Reference

### Key Tables
```sql
users        - User accounts
foods        - Food items
reviews      - User reviews
regions      - Geographic regions
ingredients  - Food ingredients
```

### Relationship Tables
```sql
food_ingredients    - Food-ingredient links
food_taste_profiles - Food-taste links
```

## Contributing
1. Report issues via GitHub
2. Follow coding standards
3. Test before committing
4. Document changes

## License
MIT License