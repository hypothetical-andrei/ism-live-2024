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
  let finished = false

  await client.subscribe('topic:1', (message) => {
    if (message) {
      console.log('Received message: ', message)
    }
  })

  while (!finished) {
    const answer = await askQuestion('Write "quit" to exit')
    if (answer.trim() === 'quit') {
      break
    }
  }

  await client.quit()
} catch (error) {
  console.warn(error)
}