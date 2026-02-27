import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold">Admin Area</h1>
      <p>Restricted content for administrators only.</p>
      <p className="text-muted-foreground">Authenticated as: {session?.user?.email}</p>
    </main>
  );
}
