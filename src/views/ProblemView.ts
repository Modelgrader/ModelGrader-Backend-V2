import { FastifyReply, FastifyRequest } from "fastify";
import ProblemController, { CreateProblemPayload } from "../controllers/Problem.controller";
import { getAccessTokenFromFastifyHeader } from "../utils/get-access-token";

export default class ProblemView {
	static async create(request: FastifyRequest<{
        Body: CreateProblemPayload;
    }>, reply: FastifyReply) {
        try {
            const token = getAccessTokenFromFastifyHeader(request);
            const payload = request.body;
            const response = await ProblemController.create(payload, token);
            reply.send(response);
        } catch (error) {
            reply.status(400).send({
                error: String(error),
            });
        }
	}
}
