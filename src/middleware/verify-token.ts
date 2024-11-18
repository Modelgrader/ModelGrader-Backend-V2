import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../database";

export async function verifyToken(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const bearerToken = request.headers["authorization"];

    if (!bearerToken) {
		return reply.code(401).send({
			message: "Unauthorized",
		});
	}

    const accessToken = bearerToken.split(" ")[1];

    // Check if the token is valid
    const account = await prisma.account.findUnique({
        where: {
            accessToken
        }
    })

    if (!account || account.tokenExpireAt! < new Date()) {
        return reply.code(401).send({
            message: "Unauthorized"
        })
    }
}
