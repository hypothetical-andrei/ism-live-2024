import redis from 'redis'

try {
  const client = redis.createClient()
  await client.connect()
  console.warn('i am connected')
  // set our values
  await client.set('user:name:1', 'jim')
  await client.set('user:counter:1', 0)
  await client.incr('user:counter:1')
  // get our values
  let result = await client.getSet('user:name:1', 'john')
  await client.append('user:name:1', ' smith')
  result = await client.get('user:name:1')
  let len = await client.strLen('user:name:1')
  result = await client.getRange('user:name:1', 5, len)
  console.warn(result)
  await client.quit()
} catch (error) {
  console.warn(error)
}