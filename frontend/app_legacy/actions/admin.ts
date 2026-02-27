"use server";

import { randomBytes } from "crypto";

import { PostStatus, PostType, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import sanitizeHtml from "sanitize-html";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function assertAdmin() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    throw new Error("Forbidden");
  }

  return session.user.id;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function upsertCategory(formData: FormData) {
  await assertAdmin();

  const categoryId = String(formData.get("categoryId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const parentId = String(formData.get("parentId") || "").trim();

  if (!name) {
    throw new Error("Category name is required");
  }

  const payload = {
    name,
    slug: toSlug(name),
    description: description || null,
    parentId: parentId || null
  };

  if (categoryId) {
    await prisma.category.update({ where: { id: categoryId }, data: payload });
  } else {
    await prisma.category.create({ data: payload });
  }

  revalidatePath("/admin-dashboard");
}

export async function deleteCategory(categoryId: string, _formData?: FormData) {
  await assertAdmin();

  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin-dashboard");
}

export async function upsertPost(formData: FormData) {
  const actorId = await assertAdmin();

  const postId = String(formData.get("postId") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const rawContent = String(formData.get("content") || "").trim();
  const type = String(formData.get("type") || PostType.BLOG) as PostType;
  const categoryId = String(formData.get("categoryId") || "").trim();
  const tags = String(formData.get("tags") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const status = String(formData.get("status") || PostStatus.DRAFT) as PostStatus;
  const scheduledForInput = String(formData.get("scheduledFor") || "").trim();

  const metaTitle = String(formData.get("metaTitle") || "").trim();
  const metaDescription = String(formData.get("metaDescription") || "").trim();
  const ogImage = String(formData.get("ogImage") || "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") || "").trim();
  const videoUrl = String(formData.get("videoUrl") || "").trim();
  const isTikTokFeatured = String(formData.get("isTikTokFeatured") || "") === "on";

  if (!title || !rawContent) {
    throw new Error("Title and content are required");
  }

  const content = sanitizeHtml(rawContent, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "img", "iframe"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"],
      iframe: ["src", "allow", "allowfullscreen", "frameborder"]
    }
  });

  const scheduledFor = scheduledForInput ? new Date(scheduledForInput) : null;
  const resolvedStatus = status === PostStatus.SCHEDULED && !scheduledFor ? PostStatus.DRAFT : status;

  const payload = {
    title,
    slug: toSlug(title),
    excerpt: excerpt || null,
    content,
    type,
    categoryId: categoryId || null,
    tags,
    status: resolvedStatus,
    isPublished: resolvedStatus === PostStatus.PUBLISHED,
    scheduledFor: resolvedStatus === PostStatus.SCHEDULED ? scheduledFor : null,
    publishedAt: resolvedStatus === PostStatus.PUBLISHED ? new Date() : null,
    metaTitle: metaTitle || null,
    metaDescription: metaDescription || null,
    ogImage: ogImage || null,
    thumbnailUrl: thumbnailUrl || null,
    videoUrl: videoUrl || null,
    isTikTokFeatured,
    authorId: actorId
  };

  if (postId) {
    await prisma.post.update({ where: { id: postId }, data: payload });
  } else {
    await prisma.post.create({ data: payload });
  }

  revalidatePath("/admin-dashboard");
  revalidatePath("/explore");
  revalidatePath("/trending");
  revalidatePath("/news");
  revalidatePath("/blogs");
  revalidatePath("/creators-advice");
}

export async function deletePost(postId: string, _formData?: FormData) {
  await assertAdmin();
  await prisma.post.delete({ where: { id: postId } });
  revalidatePath("/admin-dashboard");
}

export async function bulkPostAction(formData: FormData) {
  await assertAdmin();

  const ids = String(formData.get("postIds") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const action = String(formData.get("action") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();

  if (!ids.length) {
    return;
  }

  if (action === "publish") {
    await prisma.post.updateMany({
      where: { id: { in: ids } },
      data: { status: PostStatus.PUBLISHED, isPublished: true, publishedAt: new Date(), scheduledFor: null }
    });
  }

  if (action === "unpublish") {
    await prisma.post.updateMany({
      where: { id: { in: ids } },
      data: { status: PostStatus.DRAFT, isPublished: false, publishedAt: null }
    });
  }

  if (action === "delete") {
    await prisma.post.deleteMany({ where: { id: { in: ids } } });
  }

  if (action === "changeCategory" && categoryId) {
    await prisma.post.updateMany({ where: { id: { in: ids } }, data: { categoryId } });
  }

  revalidatePath("/admin-dashboard");
}

export async function upsertDailyTip(formData: FormData) {
  const adminId = await assertAdmin();

  const tipId = String(formData.get("tipId") || "").trim();
  const tipDate = String(formData.get("tipDate") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const rawContent = String(formData.get("content") || "").trim();

  if (!tipDate || !title || !rawContent) {
    throw new Error("Date, title, and content are required");
  }

  const content = sanitizeHtml(rawContent);

  const payload = {
    tipDate: new Date(tipDate),
    title,
    content,
    authorId: adminId
  };

  if (tipId) {
    await prisma.dailyTip.update({ where: { id: tipId }, data: payload });
  } else {
    await prisma.dailyTip.upsert({
      where: { tipDate: new Date(tipDate) },
      update: payload,
      create: payload
    });
  }

  revalidatePath("/admin-dashboard");
  revalidatePath("/user-dashboard");
}

export async function deleteDailyTip(tipId: string, _formData?: FormData) {
  await assertAdmin();
  await prisma.dailyTip.delete({ where: { id: tipId } });
  revalidatePath("/admin-dashboard");
}

export async function generateTipPlaceholders(_formData?: FormData) {
  const adminId = await assertAdmin();
  const today = new Date();

  for (let i = 0; i < 30; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    date.setHours(0, 0, 0, 0);

    await prisma.dailyTip.upsert({
      where: { tipDate: date },
      update: {},
      create: {
        tipDate: date,
        title: `Scheduled tip placeholder (${date.toISOString().slice(0, 10)})`,
        content: "Draft this tip before publish date.",
        authorId: adminId
      }
    });
  }

  revalidatePath("/admin-dashboard");
}

export async function updateUserRole(formData: FormData) {
  await assertAdmin();

  const userId = String(formData.get("userId") || "").trim();
  const role = String(formData.get("role") || Role.USER) as Role;

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin-dashboard");
}

export async function toggleUserLock(userId: string, lock: boolean, _formData?: FormData) {
  await assertAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: lock
      ? { isActive: false, lockedUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }
      : { isActive: true, lockedUntil: null, failedLoginAttempts: 0 }
  });

  revalidatePath("/admin-dashboard");
}

export async function adminResetPassword(formData: FormData) {
  await assertAdmin();

  const userId = String(formData.get("userId") || "").trim();
  const providedPassword = String(formData.get("newPassword") || "").trim();

  const generated = providedPassword || randomBytes(6).toString("base64url");
  const passwordHash = await hash(generated, 12);

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
      isActive: true
    }
  });

  revalidatePath("/admin-dashboard");
  return { temporaryPassword: generated };
}
