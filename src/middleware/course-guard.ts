import { FastifyReply, FastifyRequest } from "fastify";
import { getAccessTokenFromFastifyHeader } from "../utils/get-access-token";
import { prisma } from "../database";

export async function courseGuard(
	request: FastifyRequest<{
        Params: { courseId: string };
    }>,
	reply: FastifyReply
) {
    const token = getAccessTokenFromFastifyHeader(request);
    const course = await prisma.course.findUnique({
        where: {
            id: request.params.courseId
        },
        include: {
            creator: {
                include: { secret: true }
            }
        }
    })

    if (!course) {
        return reply.code(404).send({
            message: "Course not found"
        })
    }

    if (course.creator.secret?.accessToken !== token) {
        return reply.code(403).send({
            message: "Forbidden"
        })
    }
}