import AuthController, { LoginPayload } from "../controllers/Auth.controller";
import { FastifyReply, FastifyRequest } from "fastify";

export default class AuthView {
	static async login(
		request: FastifyRequest<{
			Body: LoginPayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const payload = request.body;
			const response = await AuthController.login(payload);
			return reply.send(response);
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
}
