import { FastifyInstance } from "fastify";
import ProblemView from "../views/ProblemView";
import SubmissionView from "../views/SubmissionView";

export function createSubmissionRoute(server: FastifyInstance) {
    
    server.route({
        method: "POST",
        url: "/problems/:problemId/submissions",
        preHandler: [],
        handler: SubmissionView.create,
    })

}