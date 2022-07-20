import type { User } from "@prisma/client";
import type { OutgoCategory } from "@prisma/client";

import { prisma } from "~/db.server";
import { Budget, Outgo } from "@prisma/client";

export type { User } from "@prisma/client";
export type { Budget } from "@prisma/client";
export type { Income } from "@prisma/client";
export type { OutgoCategory } from "@prisma/client";

export async function getAllOutgoCategories(email: User["email"]) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      outgoCategories: true,
    },
  });

  return user?.outgoCategories;
}

export function getOutgoCategory({
  id,
  userId,
}: Pick<OutgoCategory, "id"> & {
  userId: User["id"];
}) {
  return prisma.outgoCategory.findFirst({
    where: { id, userId },
  });
}

export function createOutgoCategory({
  name,
  subcategories,
  userId,
}: Pick<OutgoCategory, "name" | "subcategories"> & {
  userId: User["id"];
}) {
  return prisma.outgoCategory.create({
    data: {
      name,
      subcategories,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteOutgoCategory({ id }: Pick<OutgoCategory, "id">) {
  return prisma.outgoCategory.deleteMany({
    where: { id },
  });
}

export function updateOutgoCategory(
  id: string,
  { name, subcategories }: Pick<OutgoCategory, "name" | "subcategories">
) {
  return prisma.outgoCategory.update({
    data: {
      name,
      subcategories,
    },
    where: { id },
  });
}
