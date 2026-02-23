import { BlogStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError } from "@/lib/security/api";
import { blogSchema } from "@/lib/validators/content";

export async function GET() {
  const posts = await prisma.blogPost.findMany({ where: { status: BlogStatus.PUBLISHED }, orderBy: { publishedAt: "desc" } });
  return Response.json(posts);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user || ![Role.ADMIN, Role.CREATOR].includes(session.user.role)) return apiError("Forbidden", 403);
  const parsed = blogSchema.safeParse(await request.json());
  if (!parsed.success) return apiError("Invalid payload", 422);
  const created = await prisma.blogPost.create({
    data: {
      ...parsed.data,
      authorId: session.user.id,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });
  return Response.json(created, { status: 201 });
}
