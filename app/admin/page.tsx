import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { getAdminUserFromCookie } from "@/lib/admin/auth";

export default async function AdminPage() {
  const admin = await getAdminUserFromCookie();
  if (!admin) redirect("/admin/login");

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-brand.deep p-5 text-white">
        <h1 className="text-2xl font-bold">Admin Control Center</h1>
        <p className="text-slate-200">Comprehensive management: users, settings, APIs, categories, and analytics.</p>
      </div>
      <AdminDashboard />
    </div>
  );
}
