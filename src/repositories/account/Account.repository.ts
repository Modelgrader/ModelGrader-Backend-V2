import { SHA256 } from 'crypto-js';
import { prisma } from '../../database';
import { AccountCreatePayload, AccountUpdatePayload } from './payload';
import { Account } from '@prisma/client';

export default class AccountRepository {
    constructor() {}

    async create(request: AccountCreatePayload): Promise<Account> {
        return prisma.account.create({
            data: {
                username: request.username,
                secret: {
                    create: {
                        password: request.password,
                        email: request.email,
                    },
                },
            },
        });
    }

    async update(id: string, request: AccountUpdatePayload): Promise<Account> {
        return prisma.account.update({
            where: {
                id: id,
            },
            data: {
                secret: {
                    update: {
                        email: request.email,
                        password: request.password,
                    },
                },
            },
        });
    }

    async getByUsername(username: string) {
        const account = await prisma.account.findUnique({
            where: { username },
            include: {
                secret: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        return account;
    }

    async get(id: string): Promise<Account | null> {
        const account = await prisma.account.findUnique({
            where: { id },
        });

        return account;
    }
}
