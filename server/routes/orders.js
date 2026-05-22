const express = require("express")
const router = express.Router()
const db = require("../db") // Đảm bảo đường dẫn tới file kết nối database của bạn chính xác

// ==========================================
// THÀNH PHẦN 1: CÁC API DÀNH CHO TRANG ADMIN
// ==========================================

// 1. LẤY DANH SÁCH TẤT CẢ ĐƠN HÀNG (ĐỂ HIỂN THỊ TRÊN TRANG ADMIN)
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

// 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (KHI ADMIN BẤM ĐỔI TRẠNG THÁI)
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const { status } = req.body

        await db.query(
            `UPDATE orders SET status = $1 WHERE id = $2`,
            [status, id]
        )

        res.json({ success: true })
    } catch (err) {
        console.error("Lỗi cập nhật trạng thái đơn:", err.message)
        res.status(500).json({ success: false, error: err.message })
    }
})


// ==========================================
// THÀNH PHẦN 2: CÁC API DÀNH CHO KHÁCH HÀNG
// ==========================================

// 3. TIẾP NHẬN ĐƠN HÀNG MỚI TỪ MẶT KHÁCH (ĐÃ LỌC SẠCH CỘT DETAIL)
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
                items, 
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

// 4. TRA CỨU TIẾN ĐỘ ĐƠN HÀNG (DÀNH CHO KHÁCH THEO DÕI QUA SĐT)
router.get("/track/:phone", async (req, res) => {
    try {
        const phone = req.params.phone
        // BỔ SUNG CỘT items VÀO CÂU LỆNH SELECT DƯỚI ĐÂY:
        const result = await db.query(
            "SELECT id, total, status, items, created_at FROM orders WHERE phone = $1 ORDER BY id DESC LIMIT 5",
            [phone]
        )
        const orders = result.rows || result
        res.json(orders) 
    } catch (err) {
        console.error("Lỗi tra cứu đơn:", err.message)
        res.status(500).json({ success: false, error: err.message })
    }
})
// BẮT BUỘC PHẢI CÓ ĐỂ SERVER CHẠY ĐƯỢC
module.exports = router