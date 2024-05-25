import Sequelize from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app2',
  password: 'ism',
  database: 'ismv3'
})

try {
  await sequelize.authenticate()
  console.log('we are connected')
} catch (error) {
  console.warn(error)
} finally {
  await sequelize.close()
}