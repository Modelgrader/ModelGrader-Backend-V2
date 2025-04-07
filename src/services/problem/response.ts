import { Problem, ProblemSolution, Testcase } from "@prisma/client";

export interface ProblemCreateResponse extends Problem {}
export interface ProblemUpdateResponse extends Problem {}
export interface ProblemGetResponse extends Problem {
    solution: ProblemSolution | null
    testcases: Testcase[]
}

export interface ProblemDeleteResponse extends Problem {}