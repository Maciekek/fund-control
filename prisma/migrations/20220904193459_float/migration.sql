/*
  Warnings:

  - You are about to alter the column `amount` on the `Income` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `amount` on the `Outgo` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Income" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "budgetId" TEXT NOT NULL,
    CONSTRAINT "Income_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Income" ("amount", "budgetId", "date", "description", "id") SELECT "amount", "budgetId", "date", "description", "id" FROM "Income";
DROP TABLE "Income";
ALTER TABLE "new_Income" RENAME TO "Income";
CREATE TABLE "new_Outgo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "subcategory" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "outgoCategoryId" TEXT NOT NULL,
    CONSTRAINT "Outgo_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Outgo_outgoCategoryId_fkey" FOREIGN KEY ("outgoCategoryId") REFERENCES "OutgoCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Outgo" ("amount", "budgetId", "date", "description", "id", "outgoCategoryId", "subcategory") SELECT "amount", "budgetId", "date", "description", "id", "outgoCategoryId", "subcategory" FROM "Outgo";
DROP TABLE "Outgo";
ALTER TABLE "new_Outgo" RENAME TO "Outgo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
