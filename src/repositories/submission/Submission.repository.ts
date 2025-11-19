import { prisma } from '../../database';
import { SubmissionCreatePayload } from './payload';

export default class SubmissionRepository {
    constructor() {}

    async create(payload: SubmissionCreatePayload) {
        return prisma.submission.create({
            data: {
                submitterId: payload.submitterId,
                problemId: payload.problemId,
                submitCode: payload.submitCode,
                submitCodeLanguage: payload.submitCodeLanguage,
                isPassed: payload.isPassed,
                score: payload.score,
                testcases: {
                    createMany: {
                        data: payload.testcases.map((output) => ({
                            testcaseId: output.testcaseId,
                            outputFilename: output.outputFilename,
                            isPassed: output.isPassed,
                            timeMs: output.timeMs,
                            memoryKb: output.memoryKb,
                            isError: output.isError,
                            isTimeLimitExceeded: output.isTimeLimitExceeded,
                            isMemoryLimitExceeded: output.isMemoryLimitExceeded,
                        })),
                    },
                },
            },
        });
    }

    async getManyByProblemId(problemId: string) {
        return prisma.submission.findMany({
            where: {
                problemId,
            },
        });
    }

    async getManyBySubmitterId(submitterId: string) {
        return prisma.submission.findMany({
            where: {
                submitterId,
            },
        });
    }

    async getManyBySubmitterIdAndProblemId(
        submitterId: string,
        problemId: string
    ) {
        return prisma.submission.findMany({
            where: {
                submitterId,
                problemId,
            },
        });
    }
}
