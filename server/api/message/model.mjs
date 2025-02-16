import { query } from "../../db/manager.mjs"

const selectUsers = async () => {
  const results = await query(`
    SELECT
      *
    FROM
      users;
  `)
  return results.rows
}

const selectMessages = async () => {
  const results = await query(`
    SELECT
      messages.id,
      users.name AS user_name,
      messages.message,
      messages.created_unixtime
    FROM
      messages
    INNER JOIN users
      ON messages.user_id = users.id
  `)
  return results.rows
}
const insertMessage = async (name, age) => {
  const createdUnixtime = new Date().getTime()
  const insertQuery = `
    INSERT INTO messages(
      user_id,
      message,
      created_unixtime
    )
    VALUES(
      $1,
      $2,
      ${createdUnixtime}
    )
    RETURNING *;
  `
  const result = await query(insertQuery, [name, age])
  return result.rows.at(0)
}

const deleteMessage = async (id) => {
  const deleteQuery = `
    DELETE FROM
      messages
    WHERE
      id = $1
    RETURNING *;
  `
  const result = await query(deleteQuery, [id])
  return result.rows.at(0)
}

export const messageModel = {
  selectUsers,
  selectMessages,
  insertMessage,
  deleteMessage,
}
