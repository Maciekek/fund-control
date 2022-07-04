import type { Password, User, Budget } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";
export type { Budget } from "@prisma/client";

export async function getAllBudgets(email: User["email"]) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      budget: true,
    },
  });

  return user?.budget;
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
