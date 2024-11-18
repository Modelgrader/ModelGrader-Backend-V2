
import { FastifyReply, FastifyRequest } from "fastify";
import AccountController, { CreateAccountPayload } from "../controllers/Account.controller";

export default class AccountView {
	static async create(
		request: FastifyRequest<{
			Body: CreateAccountPayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const payload = request.body;
			const response = await AccountController.create(payload);
			return reply.send(response);
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
}
