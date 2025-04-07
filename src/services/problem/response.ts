import { Problem, ProblemSolution } from '@prisma/client';
import { ExtendedTestcase } from '../../models/Testcase';

export interface ProblemCreateResponse extends Problem {
    solution: ProblemSolution | null;
    testcases: ExtendedTestcase[];
}
export interface ProblemUpdateResponse extends Problem {
    solution: ProblemSolution | null;
    testcases: ExtendedTestcase[];
}
export interface ProblemGetResponse extends Problem {
    solution: ProblemSolution | null;
    testcases: ExtendedTestcase[];
}

export interface ProblemDeleteResponse extends Problem {}
