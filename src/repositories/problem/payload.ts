interface ProblemCreatePayload {
    creatorId: string;
    title: string;
    description?: string;
    code: string;
    language: string;
    timeLimitMs: number;
    memoryLimitKb: number;
    testcases: {
        inputFilename: string
        outputFilename: string
        order: number
        isError: boolean
        isTimeout: boolean
        isMemoryExceeded: boolean
    }[]
}

interface ProblemUpdatePayload {
    id: string;
    title?: string;
    description?: string;
    code?: string;
    language?: string;
    timeLimitMs?: number;
    memoryLimitKb?: number;
    testcases?: {
        inputFilename: string
        outputFilename: string
        order: number
        isError: boolean
        isTimeout: boolean
        isMemoryExceeded: boolean
    }[]
}