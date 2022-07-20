-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "outgoId" TEXT NOT NULL,
    "incomeId" TEXT NOT NULL,
    CONSTRAINT "Tag_outgoId_fkey" FOREIGN KEY ("outgoId") REFERENCES "Outgo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Tag_incomeId_fkey" FOREIGN KEY ("incomeId") REFERENCES "Income" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
