import mongoose from 'mongoose'
import redis from 'redis'

await mongoose.connect('mongodb://root:ism@localhost:27017/ismv4?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const client = redis.createClient('redis://127.0.0.1:6379')
await client.connect()

const UserSchema = new mongoose.Schema({
  name: String
})

const User = mongoose.model('User', UserSchema)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function () {
  this.useCache = true
  return this
}

mongoose.Query.prototype.exec = async function (...args) {
  if (!this.useCache) {
    return exec.apply(this, args)
  }

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  )

  const cacheValue = await client.get(key)

  if (cacheValue) {
    console.log('From Redis cache')
    const results = JSON.parse(cacheValue)
    if (Array.isArray(results)) {
      return results.map(e => new this.model(e))
    } else {
      return new this.model(results)
    }
  } else {
    console.log('Not cached')
  }

  const results = await exec.apply(this, args)
  client.set(key, JSON.stringify(results), 'EX', 10)
  
  return results
}

const user = new User({ name: 'Jim' })
await user.save()

let results = await User.find({ name: 'Jim' }).cache()
console.log(results)
results = await User.find({ name: 'Jim' }).cache()
console.log(results)

console.log('we are connect to everything')

await client.quit()
await mongoose.disconnect()