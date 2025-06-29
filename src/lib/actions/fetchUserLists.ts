"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function fetchUserLists() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      lists: {
        include: { tasks: true },
      },
    },
  });

  return user?.lists || [];
}
