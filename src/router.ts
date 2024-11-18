
import fastify from "fastify";
import AccountView from "./views/AccountView";
import AuthView from "./views/AuthView";
import ProblemView from "./views/ProblemView";
import { verifyToken } from "./middleware/verify-token";

const server = fastify();

server.post("/register", AccountView.create);
server.put("/login", AuthView.login);

server.register((server, opts, done) => {

    server.addHook("onRequest", verifyToken);

    server.post("/problems", ProblemView.create);
    done();
})

export default server;