-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submitterId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "submitCode" TEXT NOT NULL,
    "submitCodeLanguage" TEXT NOT NULL,
    "isPassed" BOOLEAN NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submission_submitterId_fkey" FOREIGN KEY ("submitterId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubmissionTestcase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "testcaseId" TEXT NOT NULL,
    "outputFilename" TEXT NOT NULL,
    "isPassed" BOOLEAN NOT NULL,
    "timeMs" INTEGER NOT NULL,
    "memoryKb" INTEGER NOT NULL,
    "isError" BOOLEAN NOT NULL,
    "isTimeLimitExceeded" BOOLEAN NOT NULL,
    "isMemoryLimitExceeded" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SubmissionTestcase_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubmissionTestcase_testcaseId_fkey" FOREIGN KEY ("testcaseId") REFERENCES "Testcase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
