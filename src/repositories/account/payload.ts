export interface AccountCreatePayload {
    username: string;
    email: string;
    password: string;
}

export interface AccountUpdatePayload {
    email?: string;
    password?: string;
}