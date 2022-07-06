/*
  Warnings:

  - Added the required column `date` to the `Outgo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Outgo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "budgetId" TEXT NOT NULL,
    CONSTRAINT "Outgo_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Outgo" ("amount", "budgetId", "description", "id") SELECT "amount", "budgetId", "description", "id" FROM "Outgo";
DROP TABLE "Outgo";
ALTER TABLE "new_Outgo" RENAME TO "Outgo";
CREATE TABLE "new_Income" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "budgetId" TEXT NOT NULL,
    CONSTRAINT "Income_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Income" ("amount", "budgetId", "description", "id") SELECT "amount", "budgetId", "description", "id" FROM "Income";
DROP TABLE "Income";
ALTER TABLE "new_Income" RENAME TO "Income";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
