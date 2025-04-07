export interface AuthUpdateTokenPayload {
    accessToken: string;
    refreshToken: string;
    tokenExpireAt: Date;
}