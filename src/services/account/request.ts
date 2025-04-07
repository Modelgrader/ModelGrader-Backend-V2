export interface AccountCreateRequest {
	email: string;
	password: string;
	username: string;
}

export interface AccountUpdateRequest {
    email?: string;
    password?: string;
    username?: string;
}