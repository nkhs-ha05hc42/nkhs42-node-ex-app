import { messageModel } from "./model.mjs"

const getUsers = async (req, res) => {
  const result = await messageModel.selectUsers()
  res.send(JSON.stringify({ status: "success", list: result }))
}

const getMessages = async (req, res) => {
  const result = await messageModel.selectMessages()
  res.send(JSON.stringify({ status: "success", list: result }))
}

const postMessage = async (req, res) => {
  const user_id = req.body.user_id
  const message = req.body.message
  const created_unixtime = req.body.created_unixtime
  if (!user_id || !message || created_unixtime != null) {
    return res.send(JSON.stringify({ status: "error" }))
  }
  const result = await messageModel.insertMessage(
    user_id,
    message,
    created_unixtime,
  )
  res.send(JSON.stringify({ status: "success", data: result }))
}

const deleteMessage = async (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.send(JSON.stringify({ status: "error" }))
  }
  const result = await messageModel.deleteMessage(id)
  if (!result) {
    return res.send(JSON.stringify({ status: "not found" }))
  }
  res.send(JSON.stringify({ status: "success", data: result }))
}

export const messageController = {
  getUsers,
  getMessages,
  postMessage,
  deleteMessage,
}
