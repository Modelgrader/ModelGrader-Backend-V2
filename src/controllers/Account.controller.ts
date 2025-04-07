// import { prisma } from "../database";
// import { SHA256 } from "crypto-js";

import { FastifyReply, FastifyRequest } from 'fastify';
import AccountService from '../services/account/Account.service';
import { AccountCreateResponse } from '../services/account/response';
import {
    AccountCreateRequest,
    AccountUpdateRequest,
} from '../services/account/request';

// export interface CreateAccountPayload {
// 	email: string;
// 	password: string;
// 	username: string;
// }

// export default class AccountController {
// 	static async create(payload: CreateAccountPayload) {

// 		const hashedPassword = SHA256(payload.password).toString();

// 		return prisma.account.create({
// 			data: {
// 				username: payload.username,
//                 secret: {
//                     create: {
//                         email: payload.email,
//                         password: hashedPassword,
//                     }
//                 }
// 			},
// 		});
// 	}
// }

export default class AccountController {
    private accountService: AccountService;

    constructor() {
        this.accountService = new AccountService();
    }

    async create(
        request: FastifyRequest<{
            Body: AccountCreateRequest;
        }>,
        reply: FastifyReply
    ) {
        try {
            const account = await this.accountService.create(request.body);
            reply.status(201).send(account);
        } catch (error) {
            reply.status(400).send({ error: (error as Error).message });
        }
    }

    async get(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        try {
            const account = await this.accountService.get(request.params.id);
            if (!account) {
                reply.status(404).send({ error: 'Account not found' });
                return;
            }
            reply.send(account);
        } catch (error) {
            reply.status(400).send({ error: (error as Error).message });
        }
    }

    async update(
        request: FastifyRequest<{
            Headers: { authorization: string };
            Body: AccountUpdateRequest;
        }>,
        reply: FastifyReply
    ) {
        try {
            const accessToken = request.headers.authorization?.split(' ')[1];
            const account = await this.accountService.update(
                accessToken,
                request.body
            );
            reply.send(account);
        } catch (error) {
            reply.status(400).send({ error: (error as Error).message });
        }
    }
}
