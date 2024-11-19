/*
  Warnings:

  - Added the required column `order` to the `Testcase` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Testcase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT NOT NULL,
    "inputFilename" TEXT NOT NULL,
    "outputFilename" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isError" BOOLEAN NOT NULL DEFAULT false,
    "isTimeLimitExceeded" BOOLEAN NOT NULL DEFAULT false,
    "isMemoryLimitExceeded" BOOLEAN NOT NULL DEFAULT false,
    "isDeprecated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Testcase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Testcase" ("createdAt", "id", "inputFilename", "isDeprecated", "isError", "isMemoryLimitExceeded", "isTimeLimitExceeded", "outputFilename", "problemId", "updatedAt") SELECT "createdAt", "id", "inputFilename", "isDeprecated", "isError", "isMemoryLimitExceeded", "isTimeLimitExceeded", "outputFilename", "problemId", "updatedAt" FROM "Testcase";
DROP TABLE "Testcase";
ALTER TABLE "new_Testcase" RENAME TO "Testcase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
