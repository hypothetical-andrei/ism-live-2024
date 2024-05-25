import { MongoClient } from 'mongodb'

const url = 'mongodb://root:ism@127.0.0.1:27017/?maxPoolSize=20&w=majority'

const dbName = 'ism'

try {
  const client = await MongoClient.connect(url)
  const db = client.db(dbName)
  console.log(db)
} catch (error) {
  console.warn(error)
}