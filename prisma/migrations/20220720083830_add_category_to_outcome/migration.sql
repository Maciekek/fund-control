/*
  Warnings:

  - Added the required column `subcategory` to the `Outgo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outgoId` to the `OutgoCategory` table without a default value. This is not possible if the table is not empty.

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
    CONSTRAINT "Outgo_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Outgo" ("amount", "budgetId", "date", "description", "id") SELECT "amount", "budgetId", "date", "description", "id" FROM "Outgo";
DROP TABLE "Outgo";
ALTER TABLE "new_Outgo" RENAME TO "Outgo";
CREATE TABLE "new_OutgoCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subcategories" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "outgoId" TEXT NOT NULL,
    CONSTRAINT "OutgoCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OutgoCategory_outgoId_fkey" FOREIGN KEY ("outgoId") REFERENCES "Outgo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OutgoCategory" ("id", "name", "subcategories", "userId") SELECT "id", "name", "subcategories", "userId" FROM "OutgoCategory";
DROP TABLE "OutgoCategory";
ALTER TABLE "new_OutgoCategory" RENAME TO "OutgoCategory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
