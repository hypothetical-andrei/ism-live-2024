import { MongoClient } from 'mongodb'

const url = 'mongodb://root:ism@127.0.0.1:27017/?maxPoolSize=20&w=majority'

const dbName = 'ism'
let client


try {
  client = await MongoClient.connect(url)
  const db = client.db(dbName)
  const coll = db.collection('students')
  let result = await coll.insertOne({
    name: 'bob',
    email: 'bob@somewhere.com'
  })

  let id = result.insertedId
  console.log('working with id ' + id)

  let record = await coll.findOne({ _id: id })
  result = await coll.updateOne({ _id: id }, { $set: { email: 'bob@nowhere.com' }})
  record = await coll.findOne({ _id: id })
  await coll.deleteOne({ _id: id })
  record = await coll.findOne({ _id: id })
  console.warn(record)
} catch (error) {
  console.warn(error)
} finally {
  if (client) {
    await client.close()
  }
}