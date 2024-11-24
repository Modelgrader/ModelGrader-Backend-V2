import { FastifyReply, FastifyRequest } from "fastify";
import AccountController, {
	CreateAccountPayload,
} from "../controllers/Account.controller";
import CollectionController, {
	CreateCollectionPayload,
	UpdateCollectionPayload,
} from "../controllers/Collection.controller";
import { getAccessTokenFromFastifyHeader } from "../utils/get-access-token";

export default class CollectionView {
	static async create(
		request: FastifyRequest<{
			Body: CreateCollectionPayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const payload = request.body;
			const accessToken = getAccessTokenFromFastifyHeader(request);
			const response = await CollectionController.create(
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
	static async update(
		request: FastifyRequest<{
			Params: { collectionId: string };
			Body: UpdateCollectionPayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const collectionId = request.params.collectionId;
			const payload = request.body;
			const response = await CollectionController.update(
				collectionId,
				payload
			);
			return reply.send(response);
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
	static async delete(
		request: FastifyRequest<{
			Params: { collectionId: string };
		}>,
		reply: FastifyReply
	) {
		try {
			const collectionId = request.params.collectionId;
			const response = await CollectionController.delete(collectionId);
			return reply.send(response);
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
	static async get(
		request: FastifyRequest<{
			Params: { collectionId: string };
		}>,
		reply: FastifyReply
	) {
		try {
			const collectionId = request.params.collectionId;
			const response = await CollectionController.get(collectionId);
			return reply.send(response);
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
}
