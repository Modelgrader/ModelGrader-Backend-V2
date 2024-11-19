import { FastifyInstance } from "fastify";
import ProblemView from "../views/ProblemView";

export function createProblemRoute(server: FastifyInstance) {
    
    server.route({
        method: "POST",
        url: "/problems",
        preHandler: [],
        handler: ProblemView.create,
    })

}