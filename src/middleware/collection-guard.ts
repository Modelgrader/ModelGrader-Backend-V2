import { FastifyReply, FastifyRequest } from "fastify";
import { getAccessTokenFromFastifyHeader } from "../utils/get-access-token";
import { prisma } from "../database";

export async function collectionGuard(
	request: FastifyRequest<{
        Params: { collectionId: string };
    }>,
	reply: FastifyReply
) {
    const token = getAccessTokenFromFastifyHeader(request);
    const collection = await prisma.collection.findUnique({
        where: {
            id: request.params.collectionId
        },
        include: {
            creator: {
                include: { secret: true }
            }
        }
    })

    if (!collection) {
        return reply.code(404).send({
            message: "Collection not found"
        })
    }

    if (collection.creator.secret?.accessToken !== token) {
        return reply.code(403).send({
            message: "Forbidden"
        })
    }
}