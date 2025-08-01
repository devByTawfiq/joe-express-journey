
const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'fresh_user',
  password: process.env.DB_PASSWORD || 'my_secure_password',
  database: process.env.DB_NAME || 'fresh_web_craft_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initial database setup function
async function setupDatabase() {
  try {
    const conn = await pool.getConnection();
    
    // Create users table if not exists
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        course VARCHAR(100) NOT NULL,
        registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lastLogin TIMESTAMP NULL,
        profileImage VARCHAR(255) NULL
      )
    `);
    
    // Create user progress table if not exists
    await conn.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        course VARCHAR(100) NOT NULL,
        completed INT DEFAULT 0,
        totalModules INT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Database tables checked/created successfully');
    conn.release();
  } catch (error) {
    console.error('Database setup error:', error);
    // Continue the application even if DB setup fails
    // This allows for in-memory fallback
  }
}

module.exports = { pool, setupDatabase };
