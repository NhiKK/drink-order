// 3. TIẾP NHẬN ĐƠN HÀNG MỚI (ÉP TRUYỀN CHUỖI TRỐNG VÀO DETAIL ĐỂ TRÁNH LỖI NOT-NULL)
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

        // Giải pháp: Thêm lại cột detail vào câu lệnh SQL, nhưng gán giá trị mặc định là chuỗi rỗng '' ở mảng tham số
        const result = await db.query(
            `
            INSERT INTO orders (
                customer_name,
                phone,
                items,
                note,
                total,
                detail,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
                customer_name,
                phone,
                items, 
                note,
                total,
                "", // <--- TRUYỀN CHUỖI TRỐNG VÀO ĐÂY để database không bắt lỗi NOT NULL nữa
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