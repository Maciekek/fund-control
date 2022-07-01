-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Outgo" (
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    CONSTRAINT "Outgo_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Income" (
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    CONSTRAINT "Income_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Budget_userId_key" ON "Budget"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Outgo_budgetId_key" ON "Outgo"("budgetId");

-- CreateIndex
CREATE UNIQUE INDEX "Income_budgetId_key" ON "Income"("budgetId");
