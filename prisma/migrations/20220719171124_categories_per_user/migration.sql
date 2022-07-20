/*
  Warnings:

  - Added the required column `userId` to the `OutgoCategory` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OutgoCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "OutgoCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OutgoCategory" ("id", "name") SELECT "id", "name" FROM "OutgoCategory";
DROP TABLE "OutgoCategory";
ALTER TABLE "new_OutgoCategory" RENAME TO "OutgoCategory";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
