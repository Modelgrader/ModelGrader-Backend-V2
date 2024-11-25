import { FastifyReply, FastifyRequest } from "fastify";
import { getAccessTokenFromFastifyHeader } from "../utils/get-access-token";
import { prisma } from "../database";

export async function problemGuard(
	request: FastifyRequest<{
        Params: { problemId: string };
    }>,
	reply: FastifyReply
) {
    const token = getAccessTokenFromFastifyHeader(request);
    const problem = await prisma.problem.findUnique({
        where: {
            id: request.params.problemId
        },
        include: {
            creator: {
                include: { secret: true }
            }
        }
    })

    if (!problem) {
        return reply.code(404).send({
            message: "Problem not found"
        })
    }

    if (problem.creator.secret?.accessToken !== token) {
        return reply.code(403).send({
            message: "Forbidden"
        })
    }
}