import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  database: 'ismv3',
  user: 'app1',
  password: 'ism',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5,
  idleTimeout: 60000,
  queueLimit: 0
})

const result = await pool.query('select * from students')
console.warn(result)