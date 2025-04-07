import { AccountSecret } from '@prisma/client';
import { prisma } from '../../database';
import { AuthUpdateTokenPayload } from './payload';

export default class AuthRepository {

    async get(id: string): Promise<AccountSecret | null> {
        return prisma.accountSecret.findUnique({
            where: {
                id,
            },
            include: {
                account: true
            }
        })
    }

    async updateToken(id: string, request: AuthUpdateTokenPayload): Promise<AccountSecret> {
        return prisma.accountSecret.update({
            where: { id },
            data: {
                accessToken: request.accessToken,
                refreshToken: request.refreshToken,
                tokenExpireAt: request.tokenExpireAt,
            },
        });
    }

    async getByAccessToken(accessToken: string): Promise<AccountSecret | null> {
        return prisma.accountSecret.findUnique({
            where: { accessToken },
            include: { account: true },
        });
    }

    async getByEmail(email: string): Promise<AccountSecret | null> {
        return prisma.accountSecret.findUnique({
            where: { email },
            include: { account: true },
        });
    }
}
