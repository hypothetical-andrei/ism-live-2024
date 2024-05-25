import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app1',
  password: 'ism',
  database: 'ismv4',
  define: {
    timestamps: false
  }
})

try {
  const storedProcQuery = 'call concatenate_with_date(?, @result)'
  const input = 'Hello!'
  await sequelize.query(storedProcQuery, { replacements: [input], type: sequelize.QueryTypes.RAW })
  const result = await sequelize.query('select @result as result',  { plain: true })
  console.log(result) 
} catch (error) {
  console.warn(error)
}