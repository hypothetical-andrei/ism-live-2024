import mysql from 'mysql2/promise'
import fs from 'fs'

let connection

try {
  connection = await mysql.createConnection({
    host: 'localhost',
    database: 'ismv3',
    user: 'app1',
    password: 'ism',
    ssl: {
      key: fs.readFileSync('./certs/client-key.pem'),
      cert: fs.readFileSync('./certs/client-cert.pem'),
      ca: fs.readFileSync('./certs/ca.pem')
    }
  })

  let result = await connection.query('select 1+1 as test');

  console.log(result)
} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.destroy()
  }
}