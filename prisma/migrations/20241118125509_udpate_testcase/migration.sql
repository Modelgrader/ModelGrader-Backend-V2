/*
  Warnings:

  - You are about to drop the column `memoryLimitKb` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `timeLimitMs` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `deprecated` on the `Testcase` table. All the data in the column will be lost.
  - You are about to drop the column `input` on the `Testcase` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `Testcase` table. All the data in the column will be lost.
  - You are about to drop the column `runtimeStatus` on the `Testcase` table. All the data in the column will be lost.
  - Added the required column `title` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memoryLimitKb` to the `ProblemSolution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeLimitMs` to the `ProblemSolution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inputFilename` to the `Testcase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputFilename` to the `Testcase` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Problem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Problem_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Problem" ("createdAt", "creatorId", "description", "id", "updatedAt") SELECT "createdAt", "creatorId", "description", "id", "updatedAt" FROM "Problem";
DROP TABLE "Problem";
ALTER TABLE "new_Problem" RENAME TO "Problem";
CREATE TABLE "new_ProblemSolution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "timeLimitMs" INTEGER NOT NULL,
    "memoryLimitKb" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProblemSolution_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProblemSolution" ("code", "createdAt", "id", "language", "problemId", "updatedAt") SELECT "code", "createdAt", "id", "language", "problemId", "updatedAt" FROM "ProblemSolution";
DROP TABLE "ProblemSolution";
ALTER TABLE "new_ProblemSolution" RENAME TO "ProblemSolution";
CREATE UNIQUE INDEX "ProblemSolution_problemId_key" ON "ProblemSolution"("problemId");
CREATE TABLE "new_Testcase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT NOT NULL,
    "inputFilename" TEXT NOT NULL,
    "outputFilename" TEXT NOT NULL,
    "isError" BOOLEAN NOT NULL DEFAULT false,
    "isTimeLimitExceeded" BOOLEAN NOT NULL DEFAULT false,
    "isMemoryLimitExceeded" BOOLEAN NOT NULL DEFAULT false,
    "isDeprecated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Testcase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Testcase" ("createdAt", "id", "problemId", "updatedAt") SELECT "createdAt", "id", "problemId", "updatedAt" FROM "Testcase";
DROP TABLE "Testcase";
ALTER TABLE "new_Testcase" RENAME TO "Testcase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
