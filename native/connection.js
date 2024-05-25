import mysql from 'mysql2/promise'

let connection

try {
  connection = await mysql.createConnection({
    host: 'localhost',
    database: 'ismv3',
    user: 'app1',
    password: 'ism'
  })
  
  console.log('connected')
} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.destroy()
  }
}