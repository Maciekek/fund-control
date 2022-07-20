-- CreateTable
CREATE TABLE "OutgoCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OutgoSubcategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "outgoCategoryId" TEXT NOT NULL,
    CONSTRAINT "OutgoSubcategory_outgoCategoryId_fkey" FOREIGN KEY ("outgoCategoryId") REFERENCES "OutgoCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
