import { AccountSecret } from '@prisma/client';
import { SHA256 } from 'crypto-js';
import AccountRepository from '../../repositories/account/Account.repository';
import AuthRepository from '../../repositories/auth/Auth.repository';
import { generateRandomString } from '../../utils/generate-random-string';
import { LoginRequest } from './request';
import { AuthValidateTokenResponse } from './response';

export default class AuthService {
    private authRepository: AuthRepository;
    private accountRepository: AccountRepository;

    constructor() {
        this.authRepository = new AuthRepository();
        this.accountRepository = new AccountRepository();
    }

    async login(request: LoginRequest) {
        console.log('request', request);
        let accountSecret: AccountSecret | null = null;

        accountSecret = await this.authRepository.getByEmail(
            request.emailOrUsername
        );

        if (!accountSecret) {
            const account = await this.accountRepository.getByUsername(
                request.emailOrUsername
            );

            if (!account) {
                throw new Error('Account not found');
            }
            
            if (!account.secret) {
                throw new Error('Account secret not found');
            }

            accountSecret = await this.authRepository.get(account.secret?.id);
        }

        if (!accountSecret) {
            throw new Error('Account secret not found');
        }

        const hashedPassword = SHA256(request.password).toString();

        if (accountSecret.password !== hashedPassword) {
            throw new Error('Incorrect password');
        }

        return this.authRepository.updateToken(accountSecret.id, {
            accessToken: generateRandomString(256),
            refreshToken: generateRandomString(64),
            tokenExpireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });
    }

    async validateToken(
        accessToken: string
    ): Promise<AuthValidateTokenResponse> {
        const accountSecret = await this.authRepository.getByAccessToken(
            accessToken
        );

        if (!accountSecret) {
            return {
                isValid: false,
                message: 'Invalid access token',
                secret: null,
            };
        }

        if (
            !accountSecret.tokenExpireAt ||
            accountSecret.tokenExpireAt < new Date()
        ) {
            return {
                isValid: false,
                message: 'Access token expired',
                secret: null,
            };
        }

        return {
            isValid: true,
            message: null,
            secret: accountSecret,
        };
    }
}
