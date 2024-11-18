import { FastifyInstance } from "fastify";
import ProblemView from "../views/ProblemView";

export function createProblemRoute(server: FastifyInstance) {
    server.post("/problems", ProblemView.create);
}