export interface SubmissionCreateRequest {
    submitterId: string;
    problemId: string;
    submitCode: string;
    submitCodeLanguage: string;
    isPassed: boolean;
    score: number;
    testcases: {
        submissionId: string;
        testcaseId: string;
        outputFilename: string;
        isPassed: boolean;
        timeMs: number;
        memoryKb: number;
        isError: boolean;
        isTimeLimitExceeded: boolean;
        isMemoryLimitExceeded: boolean;
    }[];
}

export interface SubmissionGetListRequest {
    submitterId?: string;
    problemId?: string;
}