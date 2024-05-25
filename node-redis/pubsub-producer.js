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
    const answer = await askQuestion('message: ')
    if (answer.trim() === 'quit') {
      break
    }
    client.publish('topic:1', answer)
  }
  await client.quit()
} catch (error) {
  console.warn(error)
}