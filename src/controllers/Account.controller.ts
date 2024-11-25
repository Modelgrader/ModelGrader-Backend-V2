import { prisma } from "../database";
import { SHA256 } from "crypto-js";

export interface CreateAccountPayload {
	email: string;
	password: string;
	username: string;
}

export default class AccountController {
	static async create(payload: CreateAccountPayload) {
        
		const hashedPassword = SHA256(payload.password).toString();

		return prisma.account.create({
			data: {
				username: payload.username,
                secret: {
                    create: {
                        email: payload.email,
                        password: hashedPassword,
                    }
                }
			},
		});
	}
}
