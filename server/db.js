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
const menuData = [
    // === CÀ PHÊ ===
    { id: 1, name: "Cà phê đen đá", price: 15000, image: "assets/capheden.jpg", status: "Còn bán", category: "Cà phê" },
    { id: 2, name: "Cà phê sữa đá", price: 20000, image: "assets/caphesua.jpg", status: "Còn bán", category: "Cà phê" },
    { id: 3, name: "Bạc xỉu", price: 22000, image: "assets/bacxiu.jpg", status: "Còn bán", category: "Cà phê" },
    { id: 4, name: "Cà phê muối", price: 25000, image: "assets/caphemuoi.jpg", status: "Còn bán", category: "Cà phê" },

    // === TRÀ TRÁI CÂY ===
    { id: 5, name: "Trà ổi hồng phô mai", price: 30000, image: "assets/traoihong.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 6, name: "Trà dâu tằm phô mai", price: 30000, image: "assets/tradautam.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 7, name: "Trà mãng cầu tươi", price: 28000, image: "assets/tramangcau.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 8, name: "Trà dâu tằm tươi", price: 28000, image: "assets/tradautamtuoi.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 9, name: "Trà mận đỏ", price: 28000, image: "assets/tramando.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 10, name: "Trà sữa thái xanh mị", price: 25000, image: "assets/trathaixanh.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 11, name: "Trà sữa thái đỏ mị", price: 25000, image: "assets/trathaido.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 12, name: "Trà mãng cầu hạt đác", price: 32000, image: "assets/tramangcauhatdac.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 13, name: "Trà dâu tằm hạt đác", price: 32000, image: "assets/tradautamhatdac.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 14, name: "Trà mận đỏ hạt đác", price: 32000, image: "assets/tramandohatdac.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 15, name: "Trà đào", price: 25000, image: "assets/tradao.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 16, name: "Trà đào hạt đác", price: 30000, image: "assets/tradaohatdac.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 17, name: "Trà vải", price: 25000, image: "assets/travai.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 18, name: "Trà vải hạt đác", price: 30000, image: "assets/travaihatdac.jpg", status: "Còn bán", category: "Trà trái cây" },
    { id: 19, name: "Hạt đác rim thơm (Thêm)", price: 5000, image: "assets/hatdacrim.jpg", status: "Còn bán", category: "Trà trái cây" },

    // === TRÀ SỮA ===
    { id: 20, name: "Trà sữa Nhà Mị truyền thống", price: 25000, image: "assets/trasuatruyenthong.jpg", status: "Còn bán", category: "Trà sữa" },
    { id: 21, name: "Trà sữa sương sáo", price: 25000, image: "assets/trasuasuongsao.jpg", status: "Còn bán", category: "Trà sữa" },
    { id: 22, name: "Trà sữa trân châu hoàng kim", price: 27000, image: "assets/trasuatranchau.jpg", status: "Còn bán", category: "Trà sữa" },
    { id: 23, name: "Trà sữa bánh flan nhà làm", price: 30000, image: "assets/trasuabanhflan.jpg", status: "Còn bán", category: "Trà sữa" },
    { id: 24, name: "Trà sữa thập cẩm", price: 35000, image: "assets/trasuathapcam.jpg", status: "Còn bán", category: "Trà sữa" },

    // === NƯỚC ÉP ===
    { id: 25, name: "Nước ép cam nguyên chất", price: 25000, image: "assets/epcam.jpg", status: "Còn bán", category: "Nước ép" },
    { id: 26, name: "Nước ép cà rốt nguyên chất", price: 25000, image: "assets/epcarot.jpg", status: "Còn bán", category: "Nước ép" },
    { id: 27, name: "Nước ép thơm nguyên chất", price: 25000, image: "assets/epthom.jpg", status: "Còn bán", category: "Nước ép" },
    { id: 28, name: "Nước ép cam cà rốt", price: 27000, image: "assets/epcamcarot.jpg", status: "Còn bán", category: "Nước ép" },
    { id: 29, name: "Nước ép cam thơm", price: 27000, image: "assets/epcamthom.jpg", status: "Còn bán", category: "Nước ép" }
];
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
    //
      console.log(`📥 Đang nạp lại ${menuData.length} món ăn mới từ ảnh vào database...`);
      const insertQuery = `
        INSERT INTO menu (id, name, price, image, status, category)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      for (const item of menuData) {
        await pool.query(insertQuery, [
          item.id,
          item.name,
          item.price,
          item.image,
          item.status,
          item.category
        ]);
      }

      await pool.query("COMMIT");
      console.log("✨ THÀNH CÔNG: Đã làm sạch và cập nhật dữ liệu Menu Tiệm Nhà Mị mới nhất!");
    //

    console.log("=== ĐỒNG BỘ DB: BỔ SUNG category! ===");

  } catch (err) {
    console.error("=== [DATABASE ERROR] Lỗi tự động tạo bảng: ===", err);
  }
}

// Chạy hàm tạo bảng ngay khi khởi động server
createTablesIfNotExist();
module.exports = pool;
