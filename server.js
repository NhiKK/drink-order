const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
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

app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// 1. Cấu hình thông tin kết nối với Cloudinary (Lấy từ Environment Variables trên Render)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Thiết lập cấu hình bộ lưu trữ Multer đẩy thẳng lên Cloudinary thay vì lưu file vật lý cục bộ
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "tiem_nha_mi_menu", // Thư mục lưu ảnh tự động sinh ra trên giao diện Cloudinary của bạn
        allowed_formats: ["jpg", "png", "jpeg", "webp"], // Các định dạng file cho phép upload
        public_id: (req, file) => "product_" + Date.now(), // Tạo tên file ảnh ngẫu nhiên bằng thời gian để chống trùng
    },
});

const upload = multer({ storage: storage })

// 3. API xử lý upload ảnh từ giao diện Admin
app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: "Không tìm thấy file ảnh tải lên!" })
        }
        
        // Điểm mấu chốt: req.file.path lúc này CHÍNH LÀ đường dẫn URL vĩnh viễn (https://res.cloudinary.com/...) do Cloudinary cấp
        const permanentImageUrl = req.file.path;

        // Trả link ảnh trực tiếp này về cho trang Admin để lưu vào Database món ăn
        res.json({
            success: true,
            url: permanentImageUrl
        })
    } catch (err) {
        console.error("Lỗi upload Cloudinary:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
})

app.use("/api/menu", require("./server/routes/menu"))
app.use("/api/orders", require("./server/routes/orders"))

// Chạy Server Backend
app.listen(process.env.PORT, () => {
    console.log("SERVER IS RUNNING ON PORT:", process.env.PORT)
})