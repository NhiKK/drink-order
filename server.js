const express = require("express")
const cors = require("cors")
const multer = require("multer")
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config()

const app = express()

// Bật CORS cho phép GitHub Pages truy cập dữ liệu công khai
app.use(cors())

app.use(express.json({
    limit: "50mb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}))

// Giữ lại định tuyến này để các ảnh local cũ không bị lỗi hiển thị ngay lập tức
app.use("/uploads", express.static("uploads"))
app.use(express.static("public"))

// ==========================================
// CẤU HÌNH KẾT NỐI VÀ LƯU TRỮ CLOUDINARY
// ==========================================

// 1. Cấu hình thông tin xác thực tài khoản Cloudinary lấy từ Environment Variables trên Render
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Thiết lập bộ lưu trữ đám mây thay thế hoàn toàn cho diskStorage cũ
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "tiem_nha_mi_menu", // Thư mục tự động tạo trên Cloudinary của bạn
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Định dạng file cho phép
        public_id: (req, file) => "product_" + Date.now(), // Tên file chống trùng lặp
    },
});

// 3. Gắn cấu hình cloud vào multer
const upload = multer({ storage: storage })

// 4. API xử lý upload ảnh từ Admin và trả về link tuyệt đối
app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "Không nhận được file ảnh!" })
        }
        
        // req.file.path từ multer-storage-cloudinary chính là link URL vĩnh viễn dạng https://res.cloudinary.com/...
        const permanentImageUrl = req.file.path;

        res.json({
            success: true,
            url: permanentImageUrl 
        })
    } catch (err) {
        console.error("Lỗi xử lý tải ảnh lên Cloudinary:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
})

// Định tuyến các chức năng khác
app.use("/api/menu", require("./server/routes/menu"))
app.use("/api/orders", require("./server/routes/orders"))
app.use("/api/categories", require("./server/routes/categories"))
// Chạy Server Backend
app.listen(process.env.PORT, () => {
    console.log("SERVER IS RUNNING ON PORT:", process.env.PORT)
})