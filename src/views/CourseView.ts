import { FastifyReply, FastifyRequest } from "fastify";
import CourseController, { UpdateCoursePayload } from "../controllers/Course.controller";
import { CreateCoursePayload } from "../controllers/Course.controller";
import { getAccessTokenFromFastifyHeader } from "../utils/get-access-token";

export default class CourseView {
	static async create(
		request: FastifyRequest<{
			Body: CreateCoursePayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const payload = request.body;
			const accessToken = getAccessTokenFromFastifyHeader(request);
			const response = await CourseController.create(
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
			Params: { courseId: string };
			Body: UpdateCoursePayload;
		}>,
		reply: FastifyReply
	) {
		try {
			const courseId = request.params.courseId;
			const payload = request.body;
			const response = await CourseController.update(
				courseId,
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
			Params: { courseId: string };
		}>,
		reply: FastifyReply
	) {
		try {
			const courseId = request.params.courseId;
			const response = await CourseController.delete(courseId);
			return reply.send(response);
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
	static async get(
		request: FastifyRequest<{
			Params: { courseId: string };
		}>,
		reply: FastifyReply
	) {
		try {
			const courseId = request.params.courseId;
			const response = await CourseController.get(courseId);
			return reply.send(response);
		} catch (error) {
			return reply.status(400).send({
				error: String(error),
			});
		}
	}
}
