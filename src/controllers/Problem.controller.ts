import { ProgrammingLanguage } from "../constants/ProgrammingLanguages.constant";
import { prisma } from "../database";
import { Grader } from "../grader";

export interface CreateProblemPayload {
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
export default class ProblemController {
	static async create(payload: CreateProblemPayload, accessToken: string) {
        console.log(payload)
        const creator = await prisma.account.findUniqueOrThrow({ where: { accessToken } });
        
        const { code, language, timeLimitMs, memoryLimitKb } = payload.solution;
		const inputList = payload.testcases.map((testcase) => testcase.input);
		const outputResponse = await Grader.generateOutput(
			code,
			inputList,
			language,
			timeLimitMs,
			memoryLimitKb * 1024
		);

        return prisma.problem.create({
            data: {
                title: payload.title,
                description: payload.description,
                creatorId: creator.id,
                solution: {
                    create: {
                        code,
                        language,
                        timeLimitMs,
                        memoryLimitKb,
                    },
                },
                testcases: {
                    createMany: {
                        data: outputResponse.outputList.map((output, index) => ({
                            inputFilename: output.inputFilename,
                            outputFilename: output.outputFilename,
                            order: index,
                            isError: output.isError,
                            isTimeLimitExceeded: output.isTimeout,
                            isMemoryLimitExceeded: output.isMemoryExceeded,
                        }))
                    }
                }
            },
            include: {
                creator: true,
                solution: true,
                testcases: {
                    orderBy: {
                        order: "asc"
                    }
                },
            },
        })

	}
}
