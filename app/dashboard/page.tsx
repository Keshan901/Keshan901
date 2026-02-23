import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const [tips, savedTotal, publicPosts] = await Promise.all([
    prisma.dailyTip.findMany({ orderBy: { date: "desc" }, take: 5 }),
    prisma.savedItem.count({ where: { userId: session.user.id } }),
    prisma.keywordSet.count({ where: { authorId: session.user.id, visibility: "PUBLIC" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>Total Saved: {savedTotal}</Card>
        <Card>Total Public Posts: {publicPosts}</Card>
        <Card>Most Copied: {tips[0]?.title ?? "No data yet"}</Card>
      </div>
      <Card>
        <h2 className="mb-3 text-xl font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Add Keyword Set</Button><Button>Add Hashtag Set</Button><Button variant="outline">Save to Private</Button><Button variant="gradient">Publish to Public</Button>
        </div>
      </Card>
      <Card>
        <h2 className="mb-3 text-xl font-semibold">Tip of the Day</h2>
        <p>{tips[0]?.body ?? "No tips available."}</p>
      </Card>
      <Card>
        <h2 className="mb-3 text-xl font-semibold">Daily Tips Feed</h2>
        <ul className="space-y-2">{tips.map((tip) => <li key={tip.id}><strong>{tip.title}</strong> - {tip.body}</li>)}</ul>
      </Card>
    </div>
  );
}
