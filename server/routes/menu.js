const express = require("express")
const router = express.Router()
const db = require("../db")

// 1. LẤY DANH SÁCH MENU (SỬA ĐỂ PHÙ HỢP VỚI THƯ VIỆN 'pg')
router.get(
    "/",
    async (req, res) => {
        try {
            const result = await db.query(
                `
                SELECT m.* FROM menu m
                LEFT JOIN categories c ON m.category = c.name
                WHERE m.status != 'Ngừng bán'
                ORDER BY 
                    c.id ASC, 
                    m.id ASC 
                `
            );

            // Thư viện 'pg' trả về Object, dữ liệu thực tế nằm trong mảng .rows
            const rows = result.rows || result;

            res.json(rows)
        } catch (err) {
            console.error("Lỗi khi lấy menu:", err.message);
            res.status(500).json({ success: false, error: err.message });
        }
    }
)

// 2. CẬP NHẬT TOÀN BỘ MENU (ĐÃ CHUẨN POSTGRESQL)
router.post(
    "/",
    async (req, res) => {
        try {
            const menu = req.body

            // Xóa toàn bộ menu cũ trước khi nạp mới
            await db.query("DELETE FROM menu")

            for (const item of menu) {
                await db.query(
                    `
                    INSERT INTO menu (
                        id,
                        name,
                        price,
                        image,
                        status,
                        category
                    )
                    VALUES ($1, $2, $3, $4, $5, $6)
                    `,
                    [
                        item.id,
                        item.name,
                        item.price,
                        item.image,
                        item.status,
                        item.category || "Khác"
                    ]
                )
            }

            res.json({
                success: true
            })
        } catch (err) {
            console.error("Lỗi khi cập nhật menu:", err.message);
            res.status(500).json({ success: false, error: err.message });
        }
    }
)

module.exports = router
