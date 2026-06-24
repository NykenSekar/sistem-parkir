const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sistem_parkir',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

// Test koneksi
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Gagal koneksi database:', err.message);
    return;
  }
  console.log('✅ Berhasil terhubung ke database MySQL');
  connection.release();
});

module.exports = db;
