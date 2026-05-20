const express = require("express")

const router = express.Router()

const db = require("../db")

router.get(
    "/",
    async (req, res) => {

        const [rows] =

            await db.query(

                `
SELECT *
FROM menu
WHERE status!='Ngừng bán'
ORDER BY id DESC
`

            )

        res.json(rows)

    }
)

router.post(
    "/",
    async (req, res) => {

        const menu =
            req.body

        await db.query(

            "DELETE FROM menu"

        )

        for (const item of menu) {

            await db.query(

                `
INSERT INTO menu
(
id,
name,
price,
image,
status
)

VALUES($1, $2, $3, $4, $5)
`,

                [

                    item.id,

                    item.name,

                    item.price,

                    item.image,

                    item.status

                ]

            )

        }

        res.json({

            success: true

        })

    }
)

module.exports =
    router
