/*
  Warnings:

  - Added the required column `subcategory` to the `Outgo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Outgo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "subcategory" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "outgoCategoryId" TEXT NOT NULL,
    CONSTRAINT "Outgo_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Outgo_outgoCategoryId_fkey" FOREIGN KEY ("outgoCategoryId") REFERENCES "OutgoCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Outgo" ("amount", "budgetId", "date", "description", "id", "outgoCategoryId") SELECT "amount", "budgetId", "date", "description", "id", "outgoCategoryId" FROM "Outgo";
DROP TABLE "Outgo";
ALTER TABLE "new_Outgo" RENAME TO "Outgo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
