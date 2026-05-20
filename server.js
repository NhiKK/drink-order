const express=require("express")
const cors=require("cors")
const multer=require("multer")
const path=require("path")
require("dotenv").config()

const app=express()

app.use(cors())

app.use(express.json({
limit:"50mb"
}))

app.use(express.urlencoded({
extended:true,
limit:"50mb"
}))

app.use(
express.static("public")
)

app.use(
"/uploads",
express.static("uploads")
)

const storage=

multer.diskStorage({

destination:(req,file,cb)=>{

cb(
null,
"./uploads"
)

},

filename:(req,file,cb)=>{

const ext=

path.extname(
file.originalname
)

const fileName=

Date.now()+ext

cb(
null,
fileName
)

}

})

const upload=

multer({

storage

})

app.post(

"/api/upload",

upload.single(
"image"
),

(req,res)=>{

if(
!req.file
){

return res
.status(400)
.json({

success:false

})

}

res.json({

success:true,

url:

"/uploads/"+
req.file.filename

})

}

)

app.use(
"/api/menu",
require("./server/routes/menu")
)

app.use(
"/api/orders",
require("./server/routes/orders")
)

app.listen(

process.env.PORT,

()=>{

console.log(

"RUNNING",

process.env.PORT

)

}
)