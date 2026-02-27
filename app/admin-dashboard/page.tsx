import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  adminResetPassword,
  bulkPostAction,
  deleteCategory,
  deleteDailyTip,
  deletePost,
  generateTipPlaceholders,
  toggleUserLock,
  updateUserRole,
  upsertCategory,
  upsertDailyTip,
  upsertPost
} from "@/app/actions/admin";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { getAdminDashboardData, normalizeAdminFilters } from "@/lib/admin-dashboard";

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    redirect("/login");
  }

  const params = await searchParams;
  const filters = normalizeAdminFilters(params);
  const data = await getAdminDashboardData(filters);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-8 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">Advanced CRUD for users, posts, categories/subcategories, and daily tips.</p>
      </header>

      <form className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-4" action="/admin-dashboard">
        <input name="q" defaultValue={filters.q} placeholder="Search users/posts" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
        <select name="role" defaultValue={filters.role ?? ""} className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm">
          <option value="">All user roles</option>
          {data.roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <select name="status" defaultValue={filters.status ?? ""} className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm">
          <option value="">All post statuses</option>
          {data.postStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button type="submit" className="h-10 rounded bg-fuchsia-500 px-3 text-sm font-medium">Apply Filters</button>
      </form>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-xl font-semibold">Users CRUD</h2>
          {data.users.map((user) => (
            <div key={user.id} className="rounded border border-white/10 bg-black/20 p-3 text-sm">
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-slate-400">{user.username} · Role: {user.role} · Active: {user.isActive ? "Yes" : "No"}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={updateUserRole}>
                  <input type="hidden" name="userId" value={user.id} />
                  <select name="role" defaultValue={user.role} className="h-8 rounded border border-white/20 bg-slate-900/70 px-2 text-xs">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <button className="ml-2 rounded border border-white/20 px-2 py-1 text-xs">Change Role</button>
                </form>
                <form action={toggleUserLock.bind(null, user.id, user.isActive)}>
                  <button className="rounded border border-yellow-300/50 px-2 py-1 text-xs text-yellow-100">
                    {user.isActive ? "Lock" : "Unlock"}
                  </button>
                </form>
                <form action={adminResetPassword} className="flex items-center gap-2">
                  <input type="hidden" name="userId" value={user.id} />
                  <input name="newPassword" placeholder="New password" className="h-8 rounded border border-white/20 bg-slate-900/70 px-2 text-xs" />
                  <button className="rounded border border-emerald-300/50 px-2 py-1 text-xs text-emerald-100">Reset Password</button>
                </form>
              </div>
            </div>
          ))}
        </article>

        <article className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-xl font-semibold">Categories & Subcategories CRUD</h2>
          <form action={upsertCategory} className="grid gap-2 rounded border border-white/10 p-3">
            <input name="name" placeholder="Category name" className="h-9 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" required />
            <input name="description" placeholder="Description" className="h-9 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
            <select name="parentId" className="h-9 rounded border border-white/20 bg-slate-900/70 px-3 text-sm">
              <option value="">No parent (top-level category)</option>
              {data.categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button className="h-9 rounded bg-cyan-600 text-sm font-medium">Save Category</button>
          </form>
          <div className="space-y-2 text-sm">
            {data.categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded border border-white/10 px-3 py-2">
                <span>{category.name} {category.parentId ? "(sub-category)" : ""}</span>
                <form action={deleteCategory.bind(null, category.id)}>
                  <button className="rounded border border-red-300/60 px-2 py-1 text-xs text-red-100">Delete</button>
                </form>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Posts CRUD + Rich Text + SEO</h2>

        <form action={upsertPost} className="grid gap-3 rounded border border-white/10 p-4">
          <input name="title" placeholder="Post title" required className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
          <input name="excerpt" placeholder="Excerpt" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
          <RichTextEditor name="content" />

          <div className="grid gap-3 sm:grid-cols-3">
            <select name="type" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm">
              {data.postTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select name="status" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm">
              {data.postStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <input type="datetime-local" name="scheduledFor" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
          </div>

          <select name="categoryId" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm">
            <option value="">No category</option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <input name="tags" placeholder="tag1, tag2, tag3" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />

          <div className="grid gap-3 sm:grid-cols-3">
            <input name="metaTitle" placeholder="SEO meta title" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
            <input name="metaDescription" placeholder="SEO meta description" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
            <input name="ogImage" placeholder="OG image URL" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
          </div>

          <button className="h-10 rounded bg-fuchsia-500 text-sm font-medium">Create Post</button>
        </form>

        <form action={bulkPostAction} className="flex flex-col gap-3 rounded border border-white/10 p-4 sm:flex-row sm:items-center">
          <input name="postIds" placeholder="Comma separated post IDs for bulk action" className="h-10 flex-1 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
          <select name="action" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm">
            <option value="publish">Publish</option>
            <option value="unpublish">Unpublish</option>
            <option value="delete">Delete</option>
            <option value="changeCategory">Change Category</option>
          </select>
          <select name="categoryId" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm">
            <option value="">Select category (for change category)</option>
            {data.categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <button className="h-10 rounded border border-white/20 px-4 text-sm">Run Bulk Action</button>
        </form>

        <div className="space-y-2 text-sm">
          {data.posts.map((post) => (
            <div key={post.id} className="rounded border border-white/10 bg-black/20 p-3">
              <p className="font-medium">{post.title}</p>
              <p className="text-xs text-slate-400">{post.type} · {post.status} · {post.category?.name || "No category"}</p>
              <p className="text-xs text-slate-500">ID: {post.id}</p>
              <form action={deletePost.bind(null, post.id)} className="mt-2">
                <button className="rounded border border-red-300/60 px-2 py-1 text-xs text-red-100">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <h2 className="text-xl font-semibold">Daily Tips CRUD</h2>
        <form action={upsertDailyTip} className="grid gap-3 rounded border border-white/10 p-4">
          <input type="date" name="tipDate" required className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
          <input name="title" placeholder="Tip title" required className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
          <RichTextEditor name="content" />
          <button className="h-10 rounded bg-cyan-600 text-sm font-medium">Save Tip</button>
        </form>

        <form action={generateTipPlaceholders}>
          <button className="rounded border border-white/20 px-3 py-2 text-sm">Generate next 30 day placeholders</button>
        </form>

        <div className="space-y-2 text-sm">
          {data.dailyTips.map((tip) => (
            <div key={tip.id} className="flex items-center justify-between rounded border border-white/10 px-3 py-2">
              <span>{tip.tipDate.toISOString().slice(0, 10)} · {tip.title}</span>
              <form action={deleteDailyTip.bind(null, tip.id)}>
                <button className="rounded border border-red-300/60 px-2 py-1 text-xs text-red-100">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
