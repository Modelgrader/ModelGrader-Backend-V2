import { FastifyRequest } from "fastify";

export function getAccessTokenFromFastifyHeader(request: FastifyRequest) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
        throw new Error("Authorization header not found");
    }
    const accessToken = authorizationHeader.replace("Bearer ", "");
    return accessToken;
}