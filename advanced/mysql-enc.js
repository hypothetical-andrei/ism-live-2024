import crypto from 'crypto'
import Sequelize from 'sequelize'

const SECRET_KEY = 'supersecret'
const ALGO = 'aes-256-ctr'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'welcome123',
  database: 'ismv4',
  logging: false
})

const Secret = sequelize.define('secret', {
  encryptedContent: Sequelize.STRING,
  key: Sequelize.STRING
})

Secret.addHook('beforeCreate', async (attributes, options) => {
  const cipher = crypto.createCipher(ALGO, SECRET_KEY)
  let encrypted = cipher.update(attributes.encryptedContent, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  attributes.encryptedContent = encrypted
})

Secret.addHook('afterFind', async (results, options) => {
  const decipher = crypto.createDecipher(ALGO, SECRET_KEY)
  for (let i = 0; i < results.length; i++) {
    let decrypted = decipher.update(results[i].encryptedContent, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    results[i].encryptedContent = decrypted
  }
})

await sequelize.sync({ force: true })
await Secret.create({ encryptedContent: 'secret content' })

const secrets = await Secret.findAll({ raw: true })
console.warn(secrets)