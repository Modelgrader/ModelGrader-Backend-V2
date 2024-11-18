
import fastify from "fastify";
import AccountView from "./views/AccountView";
import AuthView from "./views/AuthView";
import { verifyToken } from "./middleware/verify-token";
import { createProblemRoute } from "./routes/problem";

const server = fastify();

server.post("/register", AccountView.create);
server.put("/login", AuthView.login);

server.register((server, _, done) => {

    server.addHook("onRequest", verifyToken);

    createProblemRoute(server);

    done();
})

export default server;