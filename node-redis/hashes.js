import redis from 'redis'

try {
  const client = redis.createClient()
  await client.connect()
  console.warn('i am connected')
  // set our values
  await client.hSet('user:1', 'username', 'john.smith')
  await client.hSet('user:1', 'type', 'admin')

  let result = await client.hGetAll('user:1')
  result = await client.hKeys('user:1')
  result = await client.hVals('user:1')
  result = await client.hGet('user:1', 'username')
  result = await client.hExists('user:1', 'username')

  console.warn(result)
  result = await client.hExists('user:1', 'email')

  console.warn(result)

  await client.quit()
} catch (error) {
  console.warn(error)
}