import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  if (session.user.role !== Role.ADMIN) redirect("/dashboard");

  const [apps, reports] = await Promise.all([
    prisma.creatorApplication.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.report.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
  ]);

  return <div className="space-y-4"><h1 className="text-3xl font-bold">Admin Panel</h1><Card><h2 className="font-semibold">Creator applications</h2><ul>{apps.map((a) => <li key={a.id}>{a.message} - {a.status}</li>)}</ul></Card><Card><h2 className="font-semibold">Reports</h2><ul>{reports.map((r) => <li key={r.id}>{r.reason}</li>)}</ul></Card></div>;
}
