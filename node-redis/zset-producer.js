import redis from 'redis'
import readline from 'readline'

function askQuestion (query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve) => {
    rl.question(query, answer => {
      rl.close()
      resolve(answer)
    })
  })
}

try {
  const client = redis.createClient()
  await client.connect()
 let done = false
 while (!done) {
  const answer = await askQuestion('Value/priority: ')
  if (answer.trim() === 'quit') {
    break
  }
  const [item, priority] = answer.trim().split(' ')
  await client.zAdd('tasks:1', [{ score: priority, value: item }])
 }
  // await client.quit()
} catch (error) {
  console.warn(error)
}