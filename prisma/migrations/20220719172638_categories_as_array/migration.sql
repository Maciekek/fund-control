/*
  Warnings:

  - You are about to drop the `OutgoSubcategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subcategory` to the `OutgoCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OutgoSubcategory";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OutgoCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "OutgoCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OutgoCategory" ("id", "name", "userId") SELECT "id", "name", "userId" FROM "OutgoCategory";
DROP TABLE "OutgoCategory";
ALTER TABLE "new_OutgoCategory" RENAME TO "OutgoCategory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
