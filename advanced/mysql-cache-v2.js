import  Sequelize  from 'sequelize'
import redis from 'redis'


const client = redis.createClient('redis://127.0.0.1:6379')
await client.connect()

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'welcome123',
  database: 'ismv4',
  logging: false
})

const User = sequelize.define('user', {
  username: Sequelize.STRING
})

const findAll = User.findAll

User.findAll = async function (options) {
  if (options.cache) {
    const cacheKey = JSON.stringify(options.where || 'users')
    const cachedResult = await client.get(cacheKey)
    if (cachedResult) {
      console.warn('CACHED')
      return cachedResult
    } else {
      console.warn('NOT CACHED')
    }
  }
  console.warn('NOT CACHED')
  return findAll.call(this, options)
}

User.addHook('afterFind', async (users, options) => {
  const cacheKey = JSON.stringify(options.where || 'users')
  client.setEx(cacheKey, 10, JSON.stringify(users))
})

await sequelize.sync({ force: true })
await User.create({ username: 'someuser' })

let results = await User.findAll({ where: { username: 'someuser' }, cache: true, raw: true })
console.warn(results)
results = await User.findAll({ where: { username: 'someuser' }, cache: true, raw: true })
console.warn(results)
