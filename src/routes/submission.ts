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
    server.route({
        method: "GET",
        url: "/problems/:problemId/submissions",
        preHandler: [],
        handler: SubmissionView.getAllByProblemId,
    })
    server.route({
        method: "GET",
        url: "/problems/:problemId/submissions/me",
        preHandler: [],
        handler: SubmissionView.getAllMyByProblemId,
    })
    server.route({
        method: "GET",
        url: "/submissions/:submissionId",
        preHandler: [],
        handler: SubmissionView.get,
    })

}