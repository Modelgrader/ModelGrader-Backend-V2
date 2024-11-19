import { AccountSecuredFields } from "../constants/Account.constant";
import { ProgrammingLanguage } from "../constants/ProgrammingLanguages.constant";
import { prisma } from "../database";
import { Grader } from "../grader";

export interface CreateSubmissionPayload {
	submitCode: string;
	submitCodeLanguage: ProgrammingLanguage;
}

export default class SubmissionController {
	static async create(
		problemId: string,
		payload: CreateSubmissionPayload,
		accessToken: string
	) {
		const submitter = await prisma.account.findUniqueOrThrow({
			where: { accessToken },
		});

		const problem = await prisma.problem.findUniqueOrThrow({
			where: {
				id: problemId,
			},
			include: {
                solution: true,
				testcases: true,
			},
		});

        if (!problem.solution) throw new Error("Problem has no solution");

        const inputFilenameList = problem.testcases.map((testcase) => testcase.inputFilename);
        
        const generatedOutput = await Grader.generateOutput(
            payload.submitCode,
            inputFilenameList,
            payload.submitCodeLanguage,
            problem.solution.timeLimitMs,
            problem.solution.memoryLimitKb * 1024
        )

        console.log(generatedOutput)

        return prisma.submission.create({
            data: {
                problemId: problem.id,
                submitterId: submitter.id,
                submitCode: payload.submitCode,
                submitCodeLanguage: payload.submitCodeLanguage,
                isPassed: !(generatedOutput.isError || generatedOutput.isTimeout || generatedOutput.isMemoryExceeded),
                score: generatedOutput.outputList.filter((output) => !(output.isError || output.isTimeout || output.isMemoryExceeded)).length,
                testcases: {
                    createMany: {
                        data: generatedOutput.outputList.map((output, index) => ({
                            outputFilename: output.outputFilename,
                            isError: output.isError,
                            isTimeLimitExceeded: output.isTimeout,
                            isMemoryLimitExceeded: output.isMemoryExceeded,
                            testcaseId: problem.testcases.find((testcase) => testcase.inputFilename === output.inputFilename)!.id,
                            isPassed: !(output.isError || output.isTimeout || output.isMemoryExceeded),
                            timeMs: output.executionTimeMs,
                            memoryKb: 0,
                        }))
                    }
                }
            },
            include: {
                submitter: AccountSecuredFields,
                testcases: true,
            }
        })

	}
}
