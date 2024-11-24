import { FastifyInstance } from "fastify";
import ProblemView from "../views/ProblemView";
import { problemGuard } from "../middleware/problem-guard";

export function createProblemRoute(server: FastifyInstance) {
    
    server.route({
        method: "POST",
        url: "/problems",
        preHandler: [],
        handler: ProblemView.create,
    })
    server.route({
        method: "PUT",
        url: "/problems/:problemId",
        preHandler: [problemGuard],
        handler: ProblemView.update,
    })
    server.route({
        method: "GET",
        url: "/problems/:problemId",
        preHandler: [],
        handler: ProblemView.get,
    })

}