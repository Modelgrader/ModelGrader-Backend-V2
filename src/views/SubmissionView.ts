import { FastifyReply, FastifyRequest } from "fastify";
import SubmissionController, {
	CreateSubmissionPayload,
} from "../controllers/Submission.controller";
import { getAccessTokenFromFastifyHeader } from "../utils/get-access-token";

export default class SubmissionView {
	static async create(
		request: FastifyRequest<{
			Params: { problemId: string };
			Body: CreateSubmissionPayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const { problemId } = request.params;
			const payload = request.body;
			const accessToken = getAccessTokenFromFastifyHeader(request);
			const response = await SubmissionController.create(
				problemId,
				payload,
				accessToken
			);
			return reply.send(response);
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
	static async get(
		request: FastifyRequest<{
			Params: { submissionId: string };
		}>,
		reply: FastifyReply
	) {
		try {
			const { submissionId } = request.params;
			const response = await SubmissionController.get(submissionId);
			return reply.send({ data: response });
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
	static async getAllByProblemId(
		request: FastifyRequest<{
			Params: { problemId: string };
			Body: CreateSubmissionPayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const { problemId } = request.params;
			const response = await SubmissionController.getAllByProblemId(
				problemId
			);
			return reply.send({ data: response });
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
	static async getAllMyByProblemId(
		request: FastifyRequest<{
			Params: { problemId: string };
			Body: CreateSubmissionPayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const { problemId } = request.params;
			const accessToken = getAccessTokenFromFastifyHeader(request);
			const response = await SubmissionController.getAllMyByProblemId(
				problemId,
				accessToken
			);
			return reply.send({ data: response });
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
}
