import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-user";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  return <section className="rounded-xl border bg-white p-6"><h1 className="text-2xl font-semibold text-brand.deep">My Favorites</h1><p className="mt-2 text-slate-600">Welcome {user.name}. Save your favorite hashtags, formulas, and keywords here.</p></section>;
}
