const express = require("express")
const router = express.Router()
const db = require("../db") 


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

router.get("/track/:phone", async (req, res) => {
    try {
        const phone = req.params.phone
        const result = await db.query(
            "SELECT id, total, status, created_at FROM orders WHERE phone = $1 ORDER BY id DESC LIMIT 5",
            [phone]
        )
        const orders = result.rows || result
        res.json(orders) 
    } catch (err) {
        console.error("Lỗi tra cứu đơn:", err.message)
        res.status(500).json({ success: false, error: err.message })
    }
})


module.exports = router