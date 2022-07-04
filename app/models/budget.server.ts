import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { Note } from "@prisma/client";

export type { User } from "@prisma/client";

export async function getAllBudgets(email: User["email"]) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      budget: true,
    },
  });

  return user?.budget;
}
