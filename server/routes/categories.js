const express = require("express")
const router = express.Router()
const db = require("../db") // Kết nối tới file pool db.js của bạn

// 1. API Lấy danh sách tất cả danh mục (Dùng cho cả trang Admin và trang Khách)
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM categories ORDER BY id DESC")
        res.json(result.rows || result)
    } catch (err) {
        console.error("Lỗi lấy danh mục:", err.message)
        res.status(500).json({ success: false, error: err.message })
    }
})

// 2. API Admin tạo thêm danh mục mới
router.post("/", async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(400).json({ success: false, error: "Tên danh mục không được trống!" })
        }

        const result = await db.query(
            "INSERT INTO categories (name) VALUES ($1) RETURNING *",
            [name.trim()]
        )
        res.json({ success: true, category: result.rows[0] })
    } catch (err) {
        console.error("Lỗi thêm danh mục:", err.message)
        res.status(500).json({ success: false, error: "Danh mục đã tồn tại hoặc lỗi hệ thống!" })
    }
})

// 3. API Admin xóa danh mục theo ID
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params
        await db.query("DELETE FROM categories WHERE id = $1", [id])
        res.json({ success: true, message: "Xóa danh mục thành công!" })
    } catch (err) {
        console.error("Lỗi xóa danh mục:", err.message)
        res.status(500).json({ success: false, error: err.message })
    }
})

module.exports = router