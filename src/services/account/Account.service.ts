import { SHA256 } from "crypto-js";
import { CreateAccountRequest } from "./request";

export default class AccountService {
    constructor() {}

    async create(request: CreateAccountRequest) {
        const hashedPassword = SHA256(request.password).toString();
    }
}