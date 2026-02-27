"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(postId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_postId: {
        userId: session.user.id,
        postId
      }
    }
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({
      data: {
        userId: session.user.id,
        postId
      }
    });
  }

  revalidatePath("/user-dashboard");
  revalidatePath("/news");
  revalidatePath("/blogs");
  revalidatePath("/creators-advice");

  return { favorited: !existing };
}
