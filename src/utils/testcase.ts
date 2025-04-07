import { Testcase } from '@prisma/client';

export function extendTestcaseModel(testcase: Testcase) {
    return {
        ...testcase,
        inputFileUrl: `http://localhost:8080/public/testcases/inputs/${testcase.inputFilename}`,
        outputFileUrl: `http://localhost:8080/public/testcases/outputs/${testcase.outputFilename}`,
    };
}
