import { AccountSecret } from "@prisma/client";
import { SHA256 } from "crypto-js";
import { prisma } from "../database";
import { generateRandomString } from "../utils/generate-random-string";

export interface LoginPayload {
	emailOrUsername: string;
	password: string;
}

export default class AuthController {
	static async login(payload: LoginPayload) {
		
        let accountSecret: AccountSecret | null = null;

        accountSecret = await prisma.accountSecret.findFirst({
			where: {
				email: payload.emailOrUsername,
			},
		});

        if (!accountSecret) {
            const account = await prisma.account.findFirst({
                where: { username: payload.emailOrUsername },
                include: { secret: true },
            })

            if (!account) {
                throw new Error("Account not found");
            }

            accountSecret = account.secret;
        }

		if (!accountSecret) {
			throw new Error("Account secret not found");
		}

		const hashedPassword = SHA256(payload.password).toString();
		if (accountSecret.password !== hashedPassword) {
			throw new Error("Invalid password");
		}

		return prisma.accountSecret.update({
			where: {
				id: accountSecret.id,
			},
			data: {
				accessToken: generateRandomString(256),
				refreshToken: generateRandomString(64),
				tokenExpireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			},
		});
	}
}
