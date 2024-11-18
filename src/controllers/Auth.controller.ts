import { SHA256 } from "crypto-js";
import { prisma } from "../database";
import { generateRandomString } from "../utils/generate-random-string";

export interface LoginPayload {
	emailOrUsername: string;
	password: string;
}

export default class AuthController {
	static async login(payload: LoginPayload) {
		const account = await prisma.account.findFirst({
			where: {
				OR: [
					{
						email: payload.emailOrUsername,
					},
					{
						username: payload.emailOrUsername,
					},
				],
			},
		});

		if (!account) {
			throw new Error("Account not found");
		}

        const hashedPassword = SHA256(payload.password).toString();
		if (account.password !== hashedPassword) {
			throw new Error("Invalid password");
		}

        return prisma.account.update({
            where: {
                id: account.id
            },
            data: {
                accessToken: generateRandomString(256),
                refreshToken: generateRandomString(64),
                tokenExpireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            }
        })
	}
}
