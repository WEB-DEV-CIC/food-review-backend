const { Pool } = require('pg');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
  }

  async connect(isTest = false) {
    try{
    const dbName = isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME;
    console.log(`Connecting to database: ${dbName}`);

    this.pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: dbName,
      port: process.env.DB_PORT
    });

    await this.pool.query('SELECT NOW()');
      console.log('Database connected successfully');
      return this.pool;
    } catch (err) {
      console.error('Database connection error:', err);
      throw err;
    }
  }

  query(text, params) {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool.query(text, params);
  }

  close() {
    if (this.pool) {
      this.pool.end();
    }
  }
}

const db = new Database();
module.exports = db;