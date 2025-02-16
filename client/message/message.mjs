const getMessageForm = () => {
  const messageForm = document.getElementById("message-form").elements
  const user_id = messageForm.message_user_id.value
  const message = messageForm.message.value

  return {
    user_id,
    message,
  }
}

const validateMessageForm = (messageForm) => {
  if (!messageForm.message) {
    throw new Error("メッセージが空欄です")
  }
}

const clearMessageForm = () => {
  const messageFormElement = document.getElementById("message-form").elements
  messageFormElement.message_user_id.selectedIndex = 0
  messageFormElement.message.value = ""
}

const submitMessage = async (messageForm) => {
  const fetchResult = await fetch("http://localhost:3000/api/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageForm),
  })
  const response = await fetchResult.json()
  if (response.status !== "success") {
    throw new Error(response.status)
  }
}

const deleteMessage = async (id) => {
  const fetchResult = await fetch(`http://localhost:3000/api/message/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const response = await fetchResult.json()
  if (response.status !== "success") {
    throw new Error(response.status)
  }
}

const getUsers = async () => {
  const fetchResult = await fetch("http://localhost:3000/api/message/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const response = await fetchResult.json()
  if (response.status !== "success") {
    alert("Error!")
    return
  }
  return response.list
}

const getMessages = async () => {
  const fetchResult = await fetch("http://localhost:3000/api/message", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const response = await fetchResult.json()
  if (response.status !== "success") {
    alert("Error!")
    return
  }
  return response.list
}

const addMessage = (
  messageDivElement,
  messageId,
  userName,
  message,
  createdUnixtime,
) => {
  const messageDiv = document.createElement("div")
  messageDiv.className = "message"
  messageDivElement.appendChild(messageDiv)

  const userNameDiv = document.createElement("div")
  userNameDiv.className = "user_name"
  userNameDiv.appendChild(document.createTextNode(userName))
  messageDiv.appendChild(userNameDiv)

  const messageTextDiv = document.createElement("div")
  messageTextDiv.className = "text"
  for (let [index, messageText] of message.split("\n").entries()) {
    if (index > 0) {
      messageTextDiv.appendChild(document.createElement("br"))
    }
    messageTextDiv.appendChild(document.createTextNode(messageText))
  }
  messageDiv.appendChild(messageTextDiv)

  const messageControlDiv = document.createElement("div")
  messageControlDiv.className = "control"
  messageDiv.appendChild(messageControlDiv)

  const createdDateDiv = document.createElement("div")
  createdDateDiv.className = "created-date"
  createdDateDiv.appendChild(
    document.createTextNode(new Date(Number(createdUnixtime)).toLocaleString()),
  )
  messageControlDiv.appendChild(createdDateDiv)

  const deleteButton = document.createElement("button")
  deleteButton.appendChild(document.createTextNode("削除"))
  deleteButton.dataset.id = messageId
  deleteButton.className = "delete-button"
  deleteButton.addEventListener("click", clickDeleteButton, false)
  messageControlDiv.appendChild(deleteButton)

  const bottom = messageDivElement.scrollHeight - messageDivElement.clientHeight
  messageDivElement.scroll(0, bottom)
}

const clickDeleteButton = async (event) => {
  const id = event.target.dataset.id

  const isOk = window.confirm("削除してよいですか？")
  if (!isOk) {
    return
  }

  try {
    enableLoading()
    await deleteMessage(id)
    await loadMessages()
    await sleep(500)
  } catch (err) {
    alert(err)
  } finally {
    disableLoading()
  }
}

const sleep = async (ms) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, ms),
  )
}

const loadUsers = async () => {
  const users = await getUsers()
  const userSelectElement = document.getElementById("user-select")
  for (let user of users) {
    const selectOption = document.createElement("option")
    userSelectElement.appendChild(selectOption)
    selectOption.value = user.id
    selectOption.appendChild(document.createTextNode(user.name))
  }
}

const loadMessages = async () => {
  const messages = await getMessages()
  const messageDivElement = document.getElementById("messages")
  messageDivElement.innerHTML = ""

  for (const message of messages) {
    addMessage(
      messageDivElement,
      message.id,
      message.user_name,
      message.message,
      message.created_unixtime,
    )
  }
}

const clickSubmitButton = async () => {
  try {
    const messageForm = getMessageForm()
    validateMessageForm(messageForm)
    enableLoading()
    await submitMessage(messageForm)
    await loadMessages()
    await clearMessageForm()
    await sleep(500)
  } catch (err) {
    alert(err.message)
  } finally {
    disableLoading()
  }
}

const enableLoading = () => {
  const loadingScreenElement = document.getElementById("loading-screen")
  loadingScreenElement.className = ""
}

const disableLoading = () => {
  const loadingScreenElement = document.getElementById("loading-screen")
  loadingScreenElement.className = "display-none"
}

/**
 * ウィンドウ読み込み時の処理
 */
window.onload = async () => {
  const submitButtonElement = document.getElementById("submit-button")
  submitButtonElement.addEventListener("click", clickSubmitButton, false)

  try {
    enableLoading()
    await Promise.all([loadMessages(), loadUsers()])
    await sleep(500)
  } catch (err) {
    alert(err.message)
  } finally {
    disableLoading()
  }
}
