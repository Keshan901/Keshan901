import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>You are signed in as {session?.user?.email}.</p>
      <p className="text-muted-foreground">Role: {session?.user?.role}</p>
    </main>
  );
}
