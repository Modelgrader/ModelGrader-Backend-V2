import { ProgrammingLanguage } from "../constants/ProgrammingLanguages.constant";

export interface CreateProblemPayload {
    title: string;
	description: string;
	solution: {
        code: string;
        language: ProgrammingLanguage;
        timeLimitMs: number;
        memoryLimitKb: number;
    } | null;
	testcases: {
        input: string;
    }[];
}
export default class ProblemController {
	static async create(accessToken: string, payload: CreateProblemPayload) {
		return {
			message: "Not implemented",
		};
	}
}
