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
      budget: true
    }
  });

  return user?.budget;
}

export async function getAllIncomes(id: string) {
  const budget = await prisma.income.findMany({
    where: { budgetId: id },
    take: 15
  });

  return budget;
}

export async function getAllOutgoes(id: string) {
  const budget = await prisma.outgo.findMany({
    where: { budgetId: id },
    take: 15
  });

  return budget;
}

export async function getOutgo(id: string) {
  const outgo = await prisma.outgo.findUnique({
    where: { id }
  });

  return outgo;
}


export function deleteBudget({
                               id,
                               userId
                             }: Pick<Budget, "id"> & { userId: User["id"] }) {
  return prisma.budget.deleteMany({
    where: { id, userId }
  });
}

export function createBudget({
                               name,
                               userId
                             }: Pick<Budget, "name"> & {
  userId: User["id"];
}) {
  return prisma.budget.create({
    data: {
      name,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}

export function getBudget({
                            id,
                            userId
                          }: Pick<Budget, "id"> & {
  userId: User["id"];
}) {
  return prisma.budget.findFirst({
    where: { id, userId }
  });
}

export function addIncome({
                            amount,
                            description,
                            date,
                            budgetId
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
          id: budgetId
        }
      }
    }
  });
}

export function deleteBudgetIncome({
                                     id,
                                     budgetId
                                   }: Pick<Income, "id"> & { budgetId: Budget["id"] }) {
  return prisma.income.deleteMany({
    where: { id, budgetId }
  });
}

export function deleteBudgetOutgo({
                                    id,
                                    budgetId
                                  }: Pick<Outgo, "id"> & { budgetId: Budget["id"] }) {
  return prisma.outgo.deleteMany({
    where: { id, budgetId }
  });
}

export function addOutgo({
                           amount,
                           description,
                           date,
                           budgetId
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
          id: budgetId
        }
      }
    }
  });
}

export function updateOutgo(id: string, {
  amount,
  description,
  date,
}: Pick<Outgo, "amount" | "description" | "date"> ) {
  return prisma.outgo.update({
    data: {
      amount,
      description,
      date,

    }, where: {id}
  });
}
