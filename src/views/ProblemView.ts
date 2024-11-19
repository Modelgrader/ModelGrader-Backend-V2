import { FastifyReply, FastifyRequest } from "fastify";
import ProblemController, { CreateProblemPayload, UpdateProblemPayload } from "../controllers/Problem.controller";
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
	static async update(request: FastifyRequest<{
        Params: { problemId: string };
        Body: UpdateProblemPayload;
    }>, reply: FastifyReply) {
        try {
            const token = getAccessTokenFromFastifyHeader(request);
            const problemId = request.params.problemId;
            const payload = request.body;
            const response = await ProblemController.update(problemId, payload, token);
            reply.send(response);
        } catch (error) {
            reply.status(400).send({
                error: String(error),
            });
        }
	}
	static async get(request: FastifyRequest<{
        Params: { problemId: string };
    }>, reply: FastifyReply) {
        try {
            const token = getAccessTokenFromFastifyHeader(request);
            const problemId = request.params.problemId;
            const response = await ProblemController.get(problemId, token);
            reply.send(response);
        } catch (error) {
            reply.status(400).send({
                error: String(error),
            });
        }
	}
    static async delete(request: FastifyRequest<{
        Params: { problemId: string };
    }>, reply: FastifyReply) {
        try {
            const problemId = request.params.problemId;
            const response = await ProblemController.delete(problemId);
            reply.send(response);
        } catch (error) {
            reply.status(400).send({
                error: String(error),
            });
        }
	}
}
