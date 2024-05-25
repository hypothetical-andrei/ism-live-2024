import redis from 'redis'

try {
  const client = redis.createClient()
  await client.connect()
  // initial setup
  await client.del('assets:1')
  await client.del('assets:2')
  // populate sets
  await client.sAdd('assets:1', '1')
  await client.sAdd('assets:1', '1')
  await client.sAdd('assets:1', '2')
  await client.sAdd('assets:1', '3')
  await client.sAdd('assets:2', '1')
  await client.sAdd('assets:2', '5')
  await client.sAdd('assets:2', '7')
  
  let result = await client.sCard('assets:1')
  result = await client.sMembers('assets:1')
  result = await client.sMembers('assets:2')

  let cursor = await client.sScan('assets:1', 0)
  for (const item of cursor.members) {
    console.log(item)
  }
  console.warn(result)

  await client.quit()
} catch (error) {
  console.warn(error)
}