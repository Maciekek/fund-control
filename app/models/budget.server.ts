import type { Password, User, Budget, Income, Outgo } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";
export type { Budget } from "@prisma/client";
export type { Income } from "@prisma/client";
export type { Outgo } from "@prisma/client";

export async function getAllBudgets(email: User["email"]) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      budget: true,
    },
  });

  return user?.budget;
}

export async function getLatestIncomes(id: string) {
  const incomes = await prisma.income.findMany({
    where: { budgetId: id },
    take: 15,
  });

  return incomes;
}

export async function getTotalIncome(id: string) {
  const incomes = await prisma.income.findMany({
    where: { budgetId: id },
  });
  console.log(35, incomes);

  return incomes.reduce((total, income) => {
    return total + income.amount;
  }, 0);
}

export async function getLatestOutgoes(id: string) {
  const outgoes = await prisma.outgo.findMany({
    where: { budgetId: id },
    take: 15,
  });

  return outgoes;
}

export async function getTotalOutgo(id: string) {
  const outgoes = await prisma.outgo.findMany({
    where: { budgetId: id },
  });

  return outgoes.reduce((total, outgo) => {
    return total + outgo.amount;
  }, 0);
}

export async function getOutgo(id: string) {
  const outgo = await prisma.outgo.findUnique({
    where: { id },
  });

  return outgo;
}

export function deleteBudget({
  id,
  userId,
}: Pick<Budget, "id"> & { userId: User["id"] }) {
  return prisma.budget.deleteMany({
    where: { id, userId },
  });
}

export function createBudget({
  name,
  userId,
}: Pick<Budget, "name"> & {
  userId: User["id"];
}) {
  return prisma.budget.create({
    data: {
      name,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function getBudget({
  id,
  userId,
}: Pick<Budget, "id"> & {
  userId: User["id"];
}) {
  return prisma.budget.findFirst({
    where: { id, userId },
  });
}

export function addIncome({
  amount,
  description,
  date,
  budgetId,
}: Pick<Income, "amount" | "description" | "date"> & {
  budgetId: Budget["id"];
}) {
  return prisma.income.create({
    data: {
      amount,
      description,
      date,
      budget: {
        connect: {
          id: budgetId,
        },
      },
    },
  });
}

export function deleteBudgetIncome({
  id,
  budgetId,
}: Pick<Income, "id"> & { budgetId: Budget["id"] }) {
  return prisma.income.deleteMany({
    where: { id, budgetId },
  });
}

export function deleteBudgetOutgo({
  id,
  budgetId,
}: Pick<Outgo, "id"> & { budgetId: Budget["id"] }) {
  return prisma.outgo.deleteMany({
    where: { id, budgetId },
  });
}

export function addOutgo({
  amount,
  description,
  date,
  budgetId,
}: Pick<Outgo, "amount" | "description" | "date"> & {
  budgetId: Budget["id"];
}) {
  return prisma.outgo.create({
    data: {
      amount,
      description,
      date,
      budget: {
        connect: {
          id: budgetId,
        },
      },
    },
  });
}

export function updateOutgo(
  id: string,
  { amount, description, date }: Pick<Outgo, "amount" | "description" | "date">
) {
  return prisma.outgo.update({
    data: {
      amount,
      description,
      date,
    },
    where: { id },
  });
}
