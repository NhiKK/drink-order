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

module.exports = pool;
