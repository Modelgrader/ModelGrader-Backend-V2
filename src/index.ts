import cors from '@fastify/cors'
import { configDotenv } from 'dotenv'
import server from './router'

configDotenv()
const PORT = Number(process.env.PORT) || 8080

server.register(cors, { 
    origin: '*'
})

// server.register(fastifyStatic, {
//     root: path.join(process.cwd(), 'assets'),
//     prefix: '/public/',
//     wildcard: true
// })

server.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})