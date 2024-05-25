import mysql from 'mysql2/promise'

let connection

try {
  connection = await mysql.createConnection({
    host: 'localhost',
    database: 'ismv3',
    user: 'app1',
    password: 'ism'
  })
  
  let [rows, _] = await connection.query("insert into students1 (first_name, last_name, telephone, email) values ('a', 'target', 'ph', 'a3@b.com')");
  
  [rows, _] = await connection.query("update students1 set email = 'j1@somwhere.com' where email='a3@b.com'");
  
  // [rows, _] = await connection.query("delete from students1 where email='j@somwhere.com'")

  console.warn(rows)



} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.destroy()
  }
}