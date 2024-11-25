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
    const accountSecret = await prisma.accountSecret.findUnique({
        where: {
            accessToken
        }, include: {account: true}
    })

    if (!accountSecret) {
        return reply.code(401).send({
            message: "Unauthorized"
        })
    }

    const account = accountSecret.account

    if (!account || accountSecret.tokenExpireAt! < new Date()) {
        return reply.code(401).send({
            message: "Unauthorized"
        })
    }
}
