const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function setupTestDb() {
  // connected to the main database to create the test database
  const mainPool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
    port: process.env.DB_PORT
  });

  try {
    // delete the existing test database if it exists
    await mainPool.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${process.env.TEST_DB_NAME}'
      AND pid <> pg_backend_pid();
    `);
    
    await mainPool.query(`DROP DATABASE IF EXISTS ${process.env.TEST_DB_NAME}`);
    
    // create a new test database
    await mainPool.query(`CREATE DATABASE ${process.env.TEST_DB_NAME}`);
    
    console.log('Test database created successfully');
    
    // close the connection to the main database
    await mainPool.end();
    
    // connect to the test database to set up the schema
    const testPool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
      port: process.env.DB_PORT
    });
    
    // read the SQL schema file and execute it
    const schemaSQL = await fs.readFile(
      path.join(__dirname, 'db.sql'),
      'utf8'
    );
    
    await testPool.query(schemaSQL);
    console.log('Schema created successfully');
    
    await testPool.end();
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
}

setupTestDb();