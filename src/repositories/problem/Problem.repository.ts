import { Problem } from '@prisma/client';
import { prisma } from '../../database';
import { ProblemCreatePayload, ProblemUpdatePayload } from './payload';

export default class ProblemRepository {
    constructor() {}

    async create(payload: ProblemCreatePayload) {
        console.log('payload', payload);
        return prisma.problem.create({
            data: {
                title: payload.title,
                description: payload.description,
                creatorId: payload.creatorId,
                solution: {
                    create: {
                        code: payload.code,
                        language: payload.language,
                        timeLimitMs: payload.timeLimitMs,
                        memoryLimitKb: payload.memoryLimitKb,
                    },
                },
                testcases: {
                    createMany: {
                        data: payload.testcases.map((output, index) => ({
                            inputFilename: output.inputFilename,
                            outputFilename: output.outputFilename,
                            order: index,
                            isError: output.isError,
                            isTimeLimitExceeded: output.isTimeout,
                            isMemoryLimitExceeded: output.isMemoryExceeded,
                        })),
                    },
                },
            },
            include: {
                creator: true,
                solution: true,
                testcases: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });
    }

    async update(payload: ProblemUpdatePayload) {
        return prisma.problem.update({
            where: { id: payload.id },
            data: {
                title: payload.title,
                description: payload.description,
                solution: {
                    update: {
                        code: payload.code,
                        language: payload.language,
                        timeLimitMs: payload.timeLimitMs,
                        memoryLimitKb: payload.memoryLimitKb,
                    },
                },
                testcases: {
                    createMany: {
                        data: payload.testcases
                            ? payload.testcases.map((output, index) => ({
                                  inputFilename: output.inputFilename,
                                  outputFilename: output.outputFilename,
                                  order: index,
                                  isError: output.isError,
                                  isTimeLimitExceeded: output.isTimeout,
                                  isMemoryLimitExceeded:
                                      output.isMemoryExceeded,
                              }))
                            : [],
                    },
                },
            },
            include: {
                creator: true,
                solution: true,
                testcases: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });
    }

    async delete(id: string): Promise<Problem> {
        return prisma.problem.delete({
            where: { id: id },
        });
    }

    async get(id: string) {
        return prisma.problem.findUnique({
            where: { id: id },
            include: {
                creator: true,
                solution: true,
                testcases: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });
    }
}
