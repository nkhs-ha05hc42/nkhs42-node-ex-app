import pg from "pg"

const { Pool } = pg

const pool = new Pool({
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const query = (text, params) => pool.query(text, params)

export const getClient = async () => await pool.connect()

// RestApi側では接続が切れるので使用しない
export const end = () => pool.end()
