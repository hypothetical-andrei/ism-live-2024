import mysql from 'mysql2/promise'

let connection

try {
  connection = await mysql.createConnection({
    host: 'localhost',
    database: 'ismv3',
    user: 'app1',
    password: 'ism'
  })
  
  const inputString = 'Hello'

  await connection.query('call concatenate_with_date(?, @output)', [inputString])

  const result = await connection.query('select @output as result')

  console.warn(result)

} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.destroy()
  }
}