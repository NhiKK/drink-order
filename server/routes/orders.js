const express =
    require("express")


const router =
    express.Router()

const db =
    require("../db")

require("dotenv")
    .config()

router.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM orders ORDER BY id DESC");
        //const orders = Array.isArray(result[0]) ? result[0] : result;
        const orders = result.rows || result;
        
        res.json(orders); 
    } catch (err) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.put(
    "/:id",
    async (req, res) => {

        const id =
            req.params.id

        const {
            status
        } = req.body

        await db.query(

            `
UPDATE orders
SET status=$1
WHERE id=$2
`,

            [
                status,
                id
            ]

        )

        res.json({

            success: true

        })

    })
router.post("/", async(req,res)=>{

try{

const {

customer_name,
phone,
items,
note,
total,
detail,
status

}=req.body

await db.query(

`
INSERT INTO orders(

customer_name,
phone,
items,
note,
total,
detail,
status

)

VALUES ($1, $2, $3, $4, $5, $6, $7)
`,

[
customer_name,
phone,
items,
note,
total,
detail,
status
]

)

            const text =

                `

🛎 ĐƠN MỚI

👤 ${customer_name}

📞 ${phone}

${detail}

📌 ${note}

💰 ${total}

`


            res.json({

                success: true

            })

        }
        catch (err) {

            console.log(err)

            res.status(500)

                .json({

                    success: false

                })

        }

    })

module.exports =
    router
