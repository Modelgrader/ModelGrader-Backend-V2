// import fastify from "fastify";
// import AccountView from "./views/AccountView";
// import AuthView from "./views/AuthView";
// import { verifyToken } from "./middleware/verify-token";
// import { createProblemRoute } from "./routes/problem";
// import { createSubmissionRoute } from "./routes/submission";
// import { createCollectionRoute } from "./routes/collection";

import fastify from 'fastify';
import { verifyToken } from './middleware/verify-token';
import AccountController from './controllers/Account.controller';
import AuthController from './controllers/Auth.controller';
import ProblemController from './controllers/Problem.controller';

// const server = fastify();

// server.post("/register", AccountView.create);
// server.put("/login", AuthView.login);

// server.register((server, _, done) => {

//     server.addHook("onRequest", verifyToken);

//     createProblemRoute(server);
//     createSubmissionRoute(server);
//     createCollectionRoute(server);

//     done();
// })

// export default server;

const accountController = new AccountController();
const authController = new AuthController();
const problemController = new ProblemController();

const server = fastify()
    // .setErrorHandler((error, _, reply) => {
    //     console.error('asd',error);
    //     reply.status(500).send({ error: 'Internal Server Error' });
    // })
    // .setNotFoundHandler((_, reply) => {
    //     reply.status(404).send({ error: 'Not Found' });
    // });

server.register((server, _, done) => {
    // server.addHook('onRequest', verifyToken);

    server.post('/register', accountController.create.bind(accountController));
    server.post('/login', authController.login.bind(authController));

    server.get('/accounts/:id', accountController.get.bind(accountController));
    server.put('/accounts', accountController.update.bind(accountController));

    server.get('/problems/:id', problemController.get.bind(problemController));
    server.post('/problems', problemController.create.bind(problemController));
    server.put('/problems/:id', problemController.update.bind(problemController));
    server.delete('/problems/:id', problemController.delete.bind(problemController));

    done();
});

export default server;
