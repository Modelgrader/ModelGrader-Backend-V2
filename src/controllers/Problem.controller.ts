import { AccountSecuredFields } from "../constants/Account.constant";
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

export interface UpdateProblemPayload extends CreateProblemPayload {}

export default class ProblemController {
	static async create(payload: CreateProblemPayload, accessToken: string) {
		const creator = await prisma.account.findUniqueOrThrow({
			where: { accessToken },
		});

		const { code, language, timeLimitMs, memoryLimitKb } = payload.solution;
		const inputList = payload.testcases.map((testcase) => testcase.input);
        const inputFilenameList = Grader.writeInputFile(inputList);
		const outputResponse = await Grader.generateOutput(
			code,
			inputFilenameList,
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
						data: outputResponse.outputList.map(
							(output, index) => ({
								inputFilename: output.inputFilename,
								outputFilename: output.outputFilename,
								order: index,
								isError: output.isError,
								isTimeLimitExceeded: output.isTimeout,
								isMemoryLimitExceeded: output.isMemoryExceeded,
							})
						),
					},
				},
			},
			include: {
				creator: true,
				solution: true,
				testcases: {
					orderBy: {
						order: "asc",
					},
				},
			},
		});
	}

	static async update(
		problemId: string,
		payload: UpdateProblemPayload,
		accessToken: string
	) {
		const creator = await prisma.account.findUniqueOrThrow({
			where: { accessToken },
		});
		const problem = await prisma.problem.findUniqueOrThrow({
			where: { id: problemId },
		});

        await prisma.testcase.updateMany({
            where: { problemId },
            data: {
                isDeprecated: true
            }
        })

		const { code, language, timeLimitMs, memoryLimitKb } = payload.solution;
		const inputList = payload.testcases.map((testcase) => testcase.input);
		const outputResponse = await Grader.generateOutput(
			code,
			inputList,
			language,
			timeLimitMs,
			memoryLimitKb * 1024
		);

		return prisma.problem.update({
            where: { id: problem.id },
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
						data: outputResponse.outputList.map(
							(output, index) => ({
								inputFilename: output.inputFilename,
								outputFilename: output.outputFilename,
								order: index,
								isError: output.isError,
								isTimeLimitExceeded: output.isTimeout,
								isMemoryLimitExceeded: output.isMemoryExceeded,
							})
						),
					},
				},
			},
			include: {
				creator: true,
				solution: true,
				testcases: {
					orderBy: {
						order: "asc",
					},
				},
			},
		});
	}

    static async delete(problemId: string) {
        return prisma.problem.delete({
            where: { id: problemId },
        });
    }

    static async get(problemId: string, accessToken: string) {

        const problem = await prisma.problem.findUniqueOrThrow({
            where: { id: problemId },
            include: {
                creator: true,
            }
        })

        const account = await prisma.account.findUniqueOrThrow({
            where: { accessToken }
        })

        const isCreator = problem.creator.id === account.id

        return prisma.problem.findUnique({
            where: { id: problemId },
            include: {
				creator: AccountSecuredFields,
				solution: isCreator,
				testcases: isCreator && {
                    orderBy: {
                        order: "asc"
                    }
                },
			},
        });
    }
}
