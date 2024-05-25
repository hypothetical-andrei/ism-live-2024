import mongoose from 'mongoose'
import crypto from 'crypto'

// mongosh -u root -p ism -authenticationDatabase admin
await mongoose.connect('mongodb://root:ism@localhost:27017/ismv4?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const secretSchema = new mongoose.Schema({
  encryptedContent: {
    type: String,
    required: true
  },
  key: {
    type: String,
    require: true
  }
})

const SECRET_KEY = 'supersecret'
const ALGO = 'aes-256-ctr'

secretSchema.pre('save', function (next) {
  const cipher = crypto.createCipher(ALGO, SECRET_KEY)
  let encrypted = cipher.update(this.encryptedContent, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  this.encryptedContent = encrypted
  next()
})

secretSchema.post('find', function (docs, next) {
  const decipher = crypto.createDecipher(ALGO, SECRET_KEY)
  docs.forEach(doc => {
    let decrypted = decipher.update(doc.encryptedContent, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    doc.encryptedContent = decrypted  
  })
  next()
})

const Secret = mongoose.model('Secret', secretSchema)

let secret = new Secret({
  encryptedContent: 'test123',
  key: 'a1'
})

await secret.save()

let results = await Secret.find({ key: 'a1' })
console.warn(results)