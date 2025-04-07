import { ProgrammingLanguage } from "../../constants/ProgrammingLanguages.constant";

export interface ProblemCreateRequest {
    title: string;
    description: string;
    solution: {
        code: string;
        language: ProgrammingLanguage;
        timeLimitMs: number;
        memoryLimitKb: number;
    };
    testcases: {
        input: string;
    }[];
}

export interface ProblemUpdateRequest {
    title?: string;
    description?: string;
    solution?: {
        code?: string;
        language?: ProgrammingLanguage;
        timeLimitMs?: number;
        memoryLimitKb?: number;
    };
    testcases?: {
        input: string;
    }[];
}