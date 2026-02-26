import { Visibility } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError } from "@/lib/security/api";
import { querySchema, setSchema } from "@/lib/validators/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.parse(Object.fromEntries(searchParams));

  const where = {
    visibility: Visibility.PUBLIC,
    ...(parsed.q ? { title: { contains: parsed.q, mode: "insensitive" as const } } : {}),
    ...(parsed.category ? { category: parsed.category } : {}),
    ...(parsed.platform ? { platform: parsed.platform } : {}),
  };

  const orderBy = parsed.sort === "newest" ? { createdAt: "desc" as const } : { copyCount: "desc" as const };
  const rows = await prisma.keywordSet.findMany({ where, orderBy, take: 100 });
  return Response.json(rows);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return apiError("Unauthorized", 401);

  const parsed = setSchema.safeParse(await request.json());
  if (!parsed.success) return apiError("Invalid payload", 422);

  const created = await prisma.keywordSet.create({ data: { ...parsed.data, authorId: session.user.id } });
  return Response.json(created, { status: 201 });
}
