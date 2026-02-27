"use server";

import { CommentStatus, PostType, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const COMMENTABLE_TYPES = new Set<PostType>([PostType.BLOG, PostType.NEWS]);

export async function createComment(postId: string, body: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const sanitizedBody = body.trim();

  if (sanitizedBody.length < 2) {
    throw new Error("Comment is too short");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, slug: true, type: true }
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (!COMMENTABLE_TYPES.has(post.type)) {
    throw new Error("Comments are allowed only for blogs and news posts.");
  }

  await prisma.comment.create({
    data: {
      body: sanitizedBody,
      postId: post.id,
      userId: session.user.id,
      status: CommentStatus.VISIBLE
    }
  });

  revalidatePath(`/news/${post.slug}`);
  revalidatePath(`/blogs/${post.slug}`);
  revalidatePath("/admin");
}

export async function moderateComment(
  commentId: string,
  action: "hide" | "delete" | "restore",
  reason?: string
) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    throw new Error("Forbidden");
  }

  const target = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: {
        select: { slug: true, type: true }
      }
    }
  });

  if (!target) {
    throw new Error("Comment not found");
  }

  if (action === "hide") {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        status: CommentStatus.HIDDEN,
        moderationReason: reason?.trim() || "Hidden by moderator",
        moderatedAt: new Date(),
        moderatedById: session.user.id
      }
    });
  }

  if (action === "delete") {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        status: CommentStatus.DELETED,
        moderationReason: reason?.trim() || "Deleted by moderator",
        moderatedAt: new Date(),
        moderatedById: session.user.id,
        deletedAt: new Date()
      }
    });
  }

  if (action === "restore") {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        status: CommentStatus.VISIBLE,
        moderationReason: reason?.trim() || null,
        moderatedAt: new Date(),
        moderatedById: session.user.id,
        deletedAt: null
      }
    });
  }

  revalidatePath("/admin");

  if (target.post.type === PostType.NEWS) {
    revalidatePath(`/news/${target.post.slug}`);
  }

  if (target.post.type === PostType.BLOG) {
    revalidatePath(`/blogs/${target.post.slug}`);
  }
}
