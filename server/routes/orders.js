const express = require("express")
const router = express.Router()
const db = require("../db")

require("dotenv").config()

// 1. LẤY DANH SÁCH ĐƠN HÀNG
router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM orders ORDER BY id DESC")
        const orders = result.rows || result
        res.json(orders)
    } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err.message)
        res.status(500).json({ success: false, error: err.message })
    }
})

// 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (DÀNH CHO ADMIN)
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body

        await db.query(
            `UPDATE orders SET status=$1 WHERE id=$2`,
            [status, id]
        )

        res.json({ success: true })
    } catch (err) {
        console.error("Lỗi khi cập nhật trạng thái đơn:", err.message)
        res.status(500).json({ success: false, error: err.message })
    }
})

// 3. TIẾP NHẬN ĐƠN HÀNG MỚI (ĐÃ FIX BỎ CỘT DETAIL THỪA & SỬA LỖI CÚ PHÁP)
router.post("/", async (req, res) => {
    try {
        const {
            customer_name,
            phone,
            items,
            note,
            total,
            status
        } = req.body

        // Tiến hành lưu xuống database Postgres (Bỏ hẳn cột detail không dùng)
        const result = await db.query(
            `
            INSERT INTO orders (
                customer_name,
                phone,
                items,
                note,
                total,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [
                customer_name,
                phone,
                items, // Chuỗi JSON string từ index.html
                note,
                total,
                status || "Đã nhận"
            ]
        )

        res.json({
            success: true,
            order: result.rows[0]
        })

    } catch (err) {
        console.error("Lỗi nghiêm trọng khi lưu đơn hàng vào DB:", err.message)
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
})

module.exports = router