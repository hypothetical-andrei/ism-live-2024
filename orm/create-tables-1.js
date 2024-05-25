import Sequelize from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app2',
  password: 'ism',
  database: 'ismv3',
  define: {
    timestamps: false
  }
})

sequelize.define('author', {
  name: Sequelize.STRING,
  email: Sequelize.STRING
})

try {
  await sequelize.sync({ force: true })
  console.log('we are connected')
} catch (error) {
  console.warn(error)
} finally {
  await sequelize.close()
}