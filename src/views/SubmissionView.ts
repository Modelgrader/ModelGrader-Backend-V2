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
}
