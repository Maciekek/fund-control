import type { Password, User, Budget, Income, Outgo } from "@prisma/client";

import { prisma } from "~/db.server";
import { groupBy } from "~/helpers/array";
import { getAllOutgoCategories } from "~/models/outgoCategories.server";

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

  return incomes.reduce((total, income) => {
    return total + income.amount;
  }, 0);
}

export async function getLatestOutgoes(id: string) {
  const outgoes = await prisma.outgo.findMany({
    where: { budgetId: id },
    take: 10,
    orderBy: [
      {
        date: "desc",
      },
    ],
    include: { outgoCategory: true },
  });

  return outgoes;
}

export async function getAllOutgoes(id: string) {
  const outgoes = await prisma.outgo.findMany({
    where: { budgetId: id },
    include: { outgoCategory: true },
    orderBy: [
      {
        date: "desc",
      },
    ],
  });

  return outgoes;
}

export async function getAllIncomes(id: string) {
  const incomes = await prisma.income.findMany({
    where: { budgetId: id },

    orderBy: [
      {
        date: "desc",
      },
    ],
  });

  return incomes;
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
    include: { outgoCategory: true },
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
  outgoCategoryId,
  subcategory,
}: Pick<
  Outgo,
  "amount" | "description" | "date" | "outgoCategoryId" | "subcategory"
> & {
  budgetId: Budget["id"];
}) {
  console.log(195, outgoCategoryId, subcategory);
  return prisma.outgo.create({
    data: {
      amount,
      description,
      date,
      subcategory,
      budget: {
        connect: {
          id: budgetId,
        },
      },
      outgoCategory: {
        connect: {
          id: outgoCategoryId,
        },
      },
    },
  });
}

export function updateOutgo(
  id: string,
  {
    amount,
    description,
    date,
    subcategory,
    outgoCategoryId,
  }: Pick<
    Outgo,
    "amount" | "description" | "date" | "outgoCategoryId" | "subcategory"
  >
) {
  return prisma.outgo.update({
    data: {
      amount,
      description,
      date,
      subcategory,
      outgoCategoryId,
    },
    where: { id },
  });
}

export async function getGroupedTotalOutgoes(id: string, userEmail: string) {
  const outgoes = await prisma.outgo.findMany({
    where: { budgetId: id },
  });

  const categories = await getAllOutgoCategories(userEmail);

  // console.log(200, outgoes);
  // console.log(205, categories);
  const groups = groupBy<Outgo>(outgoes, (outgo) => outgo.outgoCategoryId);

  const groupKeys = Object.keys(groups);
  // console.log(207, groupKeys);

  const groupsWithCategoryAsName = groupKeys.reduce((result: any, groupKey) => {
    const category = categories?.find(({ id }) => id === groupKey);
    const outgoesByCategory = outgoes.filter(
      (outgo) => outgo.outgoCategoryId === category?.id
    );

    const categoryTotal = outgoesByCategory.reduce((sum, outgo) => {
      return sum + outgo.amount;
    }, 0);

    const name = category?.name || "unknown category name";

    result[name] = categoryTotal;

    return result;
  }, {});

  return groupsWithCategoryAsName;
}
