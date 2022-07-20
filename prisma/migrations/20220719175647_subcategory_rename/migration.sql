/*
  Warnings:

  - You are about to drop the column `subcategory` on the `OutgoCategory` table. All the data in the column will be lost.
  - Added the required column `subcategories` to the `OutgoCategory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OutgoCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subcategories" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "OutgoCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OutgoCategory" ("id", "name", "userId") SELECT "id", "name", "userId" FROM "OutgoCategory";
DROP TABLE "OutgoCategory";
ALTER TABLE "new_OutgoCategory" RENAME TO "OutgoCategory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
