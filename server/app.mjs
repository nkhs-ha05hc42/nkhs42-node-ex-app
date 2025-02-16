import express from "express"
import cors from "cors"
import routers from "./routers.mjs"

const app = express()
const port = 3000

app.use(cors())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/", routers)

app.get("/", (req, res) => {
  res.send("hello world")
})
