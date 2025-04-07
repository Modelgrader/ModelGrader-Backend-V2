import { SHA256 } from 'crypto-js';
import { AccountUpdateRequest, AccountCreateRequest } from './request';
import { AccountCreateResponse } from './response';
import AccountRepository from '../../repositories/account/Account.repository';
import AuthService from '../auth/Auth.service';

export default class AccountService {
    private authService: AuthService;
    private accountRepository: AccountRepository;

    constructor() {
        this.authService = new AuthService();
        this.accountRepository = new AccountRepository();
    }

    async create(
        request: AccountCreateRequest
    ): Promise<AccountCreateResponse> {
        const hashedPassword = SHA256(request.password).toString();

        const account = await this.accountRepository.create({
            ...request,
            password: hashedPassword,
        });

        return account;
    }

    async get(id: string): Promise<AccountCreateResponse | null> {
        const account = await this.accountRepository.get(id);
        return account;
    }

    async update(
        accessToken: string,
        request: AccountUpdateRequest
    ): Promise<AccountCreateResponse> {
        let validate = this.authService.validateToken(accessToken);
        if (!validate) {
            throw new Error('Invalid access token');
        }

        let hashedPassword: string | undefined = undefined;
        if (request.password) {
            hashedPassword = SHA256(request.password).toString();
        }

        const account = await this.accountRepository.update(accessToken, {
            ...request,
            password: hashedPassword,
        });
        return account;
    }
}
