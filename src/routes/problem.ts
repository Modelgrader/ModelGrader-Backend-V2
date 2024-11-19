import { FastifyInstance } from "fastify";
import ProblemView from "../views/ProblemView";

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
        preHandler: [],
        handler: ProblemView.update,
    })
    server.route({
        method: "GET",
        url: "/problems/:problemId",
        preHandler: [],
        handler: ProblemView.get,
    })

}