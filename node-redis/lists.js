import redis from 'redis'
import { v4 as uuid } from 'uuid'

try {
  const client = redis.createClient()
  await client.connect()
  console.warn('i am connected')
  await client.del('asset:1')

  await client.lPush('asset:1', 'a')
  await client.lPush('asset:1', 'b')
  await client.lPush('asset:1', 'c')
  await client.lPush('asset:1', 'd')
  await client.lPush('asset:1', 'e')

  let result = await client.lPop('asset:1')
  result = await client.lRange('asset:1', 2, 2)

  const id = uuid()
  await client.lSet('asset:1', 2, id)
  result = await client.lRange('asset:1', 2, 2)
  await client.lRem('asset:1', 1, id)
  result = await client.lRange('asset:1', 2, 2)

  let len = await client.lLen('asset:1')
  result = await client.lRange('asset:1', 0, len)
  console.warn(result)

  await client.quit()
} catch (error) {
  console.warn(error)
}