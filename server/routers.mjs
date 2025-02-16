import express from "express"
import path from "path"
import { messageController } from "./api/controllers.mjs"

const routers = express.Router()

routers.get("/api/message", messageController.getMessages)
routers.get("/api/message/user", messageController.getUsers)
routers.post("/api/message", messageController.postMessage)
routers.delete("/api/message/:id", messageController.deleteMessage)

// client配下は、ブラウザサイドで実行されるファイル（HTML/JS/CSS/画像など）を配置する
routers.use(express.static(`${path.resolve()}/client`))

export default routers
