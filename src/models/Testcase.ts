import { Testcase } from '@prisma/client';

export interface ExtendedTestcase extends Testcase {
    inputFileUrl: string;
    outputFileUrl: string;
}
