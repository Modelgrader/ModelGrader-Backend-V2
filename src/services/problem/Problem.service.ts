import { ProgrammingLanguage } from '../../constants/ProgrammingLanguages.constant';
import { GenerateOutputResponse, Grader } from '../../grader';
import AuthRepository from '../../repositories/auth/Auth.repository';
import ProblemRepository from '../../repositories/problem/Problem.repository';
import { extendTestcaseModel } from '../../utils/testcase';
import AuthService from '../auth/Auth.service';
import { ProblemCreateRequest, ProblemUpdateRequest } from './request';
import {
    ProblemCreateResponse,
    ProblemDeleteResponse,
    ProblemGetResponse,
    ProblemUpdateResponse,
} from './response';

export default class ProblemService {
    private authRepository: AuthRepository;
    private problemRepository: ProblemRepository;
    private authService: AuthService;

    constructor() {
        this.authRepository = new AuthRepository();
        this.problemRepository = new ProblemRepository();
        this.authService = new AuthService();
    }

    async create(
        accessToken: string,
        request: ProblemCreateRequest
    ): Promise<ProblemCreateResponse> {
        const validate = await this.authService.validateToken(accessToken);
        if (!validate.isValid) {
            throw new Error(validate.message!);
        }

        const secret = await this.authRepository.getByAccessToken(accessToken);

        if (!secret) {
            throw new Error('Invalid access token');
        }

        const { code, language, timeLimitMs, memoryLimitKb } = request.solution;
        const inputList = request.testcases.map((testcase) => testcase.input);
        const inputFilenameList = Grader.writeInputFile(inputList);
        const outputResponse = await Grader.generateOutput(
            code,
            inputFilenameList,
            language,
            timeLimitMs,
            memoryLimitKb * 1024
        );

        const problem = await this.problemRepository.create({
            title: request.title,
            description: request.description,
            creatorId: secret.accountId,
            code: code,
            language: language,
            timeLimitMs: timeLimitMs,
            memoryLimitKb: memoryLimitKb,
            testcases: outputResponse.outputList.map((output, index) => ({
                inputFilename: output.inputFilename,
                outputFilename: output.outputFilename,
                order: index,
                isError: output.isError,
                isTimeout: output.isTimeout,
                isMemoryExceeded: output.isMemoryExceeded,
            })),
        });

        return {
            ...problem,
            testcases: problem.testcases.map(extendTestcaseModel),
        };
    }

    async update(
        accessToken: string,
        id: string,
        request: ProblemUpdateRequest
    ): Promise<ProblemUpdateResponse> {
        const validate = await this.authService.validateToken(accessToken);
        if (!validate.isValid) {
            throw new Error(validate.message!);
        }

        let code, language, timeLimitMs, memoryLimitKb;
        let inputFilenameList = [];
        let outputResponse: GenerateOutputResponse | undefined = undefined;

        if (request.solution || request.testcases) {
            const problem = await this.problemRepository.get(id);

            if (!problem || !problem.solution) {
                throw new Error('Problem not found');
            }

            if (request.solution) {
                code = request.solution.code;
                language = request.solution.language;
                timeLimitMs = request.solution.timeLimitMs;
                memoryLimitKb = request.solution.memoryLimitKb;
            }

            if (request.testcases) {
                inputFilenameList = request.testcases.map(
                    (testcase) => testcase.input
                );
            } else {
                inputFilenameList = problem.testcases.map(
                    (testcase) => testcase.inputFilename
                );
            }

            outputResponse = await Grader.generateOutput(
                code || problem.solution.code,
                inputFilenameList,
                language || (problem.solution.language as ProgrammingLanguage),
                timeLimitMs || problem.solution.timeLimitMs,
                memoryLimitKb
                    ? memoryLimitKb * 1024
                    : problem.solution.memoryLimitKb
            );
        }

        const problem = await this.problemRepository.update({
            id: id,
            title: request.title,
            description: request.description,
            code: code,
            language: language,
            timeLimitMs: timeLimitMs,
            memoryLimitKb: memoryLimitKb,
            testcases: outputResponse?.outputList.map((output, index) => ({
                inputFilename: output.inputFilename,
                outputFilename: output.outputFilename,
                order: index,
                isError: output.isError,
                isTimeout: output.isTimeout,
                isMemoryExceeded: output.isMemoryExceeded,
            })),
        });
        return {
            ...problem,
            testcases: problem.testcases.map(extendTestcaseModel),
        };
    }

    async get(id: string, accessToken?: string): Promise<ProblemGetResponse> {
        const problem = await this.problemRepository.get(id);

        if (!problem) {
            throw new Error('Problem not found');
        }

        if (accessToken) {
            const validate = await this.authService.validateToken(accessToken);

            if (
                validate.isValid &&
                validate.secret?.accountId === problem?.creatorId
            ) {
                return {
                    ...problem,
                    testcases: problem.testcases.map(extendTestcaseModel),
                };
            }
        }

        return {
            ...problem,
            solution: null,
            testcases: [],
        };
    }

    async delete(
        id: string,
        accessToken: string
    ): Promise<ProblemDeleteResponse> {
        const validate = await this.authService.validateToken(accessToken);
        if (!validate.isValid) {
            throw new Error(validate.message!);
        }

        const problem = await this.problemRepository.get(id);

        if (!problem) {
            throw new Error('Problem not found');
        }

        await this.problemRepository.delete(id);

        return problem;
    }
}
