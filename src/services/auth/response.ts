import { AccountSecret } from "@prisma/client";

export interface AuthValidateTokenResponse {
    isValid: boolean;
    message: string | null;
    secret: AccountSecret | null
}