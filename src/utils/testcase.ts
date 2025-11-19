import { Testcase } from '@prisma/client';
import { ExtendedTestcase } from '../models/Testcase';

export function extendTestcaseModel(testcase: Testcase): ExtendedTestcase {
    return {
        ...testcase,
        inputFileUrl: `http://localhost:8080/public/testcases/inputs/${testcase.inputFilename}`,
        outputFileUrl: `http://localhost:8080/public/testcases/outputs/${testcase.outputFilename}`,
    };
}
