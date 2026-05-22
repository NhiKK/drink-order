// const mysql=require("mysql2/promise")
// require("dotenv").config()

// const pool=

// mysql.createPool({

// host:
// process.env.DB_HOST,

// user:
// process.env.DB_USER,

// password:
// process.env.DB_PASSWORD,

// database:
// process.env.DB_NAME,

// waitForConnections:true,

// connectionLimit:10

// })

// module.exports=pool
const { Pool } = require('pg');
require('dotenv').config();

// Tự động kết nối bằng chuỗi URL cơ sở dữ liệu của Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

async function createTablesIfNotExist() {
  try {
    // 1. Tạo bảng menu chuẩn cấu trúc của bạn
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price INT NOT NULL,
        image TEXT,
        status VARCHAR(50) DEFAULT 'Còn bán'
      );
    `);
    await pool.query(`
    ALTER TABLE menu ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Khác';
    `);
    // 2. Tạo bảng orders lưu đơn hàng
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255),
        phone VARCHAR(50),
        items TEXT,
        note TEXT,
        total INT,
        status VARCHAR(50) DEFAULT 'Đã nhận',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
  

    console.log("=== ĐỒNG BỘ DB: BỔ SUNG category! ===");

  } catch (err) {
    console.error("=== [DATABASE ERROR] Lỗi tự động tạo bảng: ===", err);
  }
}

// Chạy hàm tạo bảng ngay khi khởi động server
createTablesIfNotExist();
module.exports = pool;
