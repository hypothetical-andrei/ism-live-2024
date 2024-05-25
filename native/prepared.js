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

  let [rows, fields] = await connection.execute('select last_name from students1 where email= ?', ["' or 1 = 1;#"])

  console.warn(rows)
  
  console.log('connected')
} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.destroy()
  }
}