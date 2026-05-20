const fs=require("fs")
const mysql=require("mysql2/promise")
const path=require("path")

async function run(){

const db=await mysql.createConnection({
host:"127.0.0.1",
user:"root",
password:"",
database:"drink_order"
})

const menu=JSON.parse(
fs.readFileSync(
"./menu.json",
"utf8"
)
)

for(const item of menu){

let image=item.image||""

if(image.startsWith("data:image")){

image=""
}

await db.query(

`
INSERT INTO menu
(
name,
price,
image,
status
)
VALUES
(
?,
?,
?,
?
)
`,

[
item.name,
item.price,
image,
item.status
]

)

}

console.log("Import xong")

db.end()

}

run()