import cors from '@fastify/cors';
import { configDotenv } from 'dotenv';
import server from './router';
import path from 'path';
import fastifyStatic from '@fastify/static';

configDotenv();
const PORT = Number(process.env.PORT) || 8080;

server.register(cors, {
    origin: '*',
});

// http://localhost:8080/public/testcases/inputs/0bbahpkFC6vs5QNR.txt
server.register(fastifyStatic, {
    root: path.join(process.cwd(), 'dumps'),
    prefix: '/public/',
    wildcard: true,
});

server.listen({ port: PORT }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
