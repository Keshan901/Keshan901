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

function BarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

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
    <main className="mx-auto min-h-screen w-full max-w-[1400px] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-20 h-fit space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <nav className="space-y-1 text-sm text-slate-300">
            <a href="#trackers" className="block rounded px-2 py-1 hover:bg-white/10">Trackers & Charts</a>
            <a href="#users" className="block rounded px-2 py-1 hover:bg-white/10">Users CRUD</a>
            <a href="#posts" className="block rounded px-2 py-1 hover:bg-white/10">Posts CRUD</a>
            <a href="#categories" className="block rounded px-2 py-1 hover:bg-white/10">Categories/Subcategories</a>
            <a href="#daily-tips" className="block rounded px-2 py-1 hover:bg-white/10">Daily Tips CRUD</a>
            <a href="#tiktok" className="block rounded px-2 py-1 hover:bg-white/10">TikTok Ideas & Videos</a>
          </nav>
          <a href="/admin" className="inline-block text-xs text-cyan-300 hover:underline">Go to moderation panel</a>
        </aside>

        <section className="space-y-8">
          <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-fuchsia-700/40 to-cyan-700/20 p-6">
            <h2 className="text-3xl font-bold">Advanced Admin Dashboard</h2>
            <p className="mt-2 text-sm text-slate-200">
              Premium content operations center with trackers, charts, and full CRUD controls.
            </p>
          </header>

          <section id="trackers" className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="text-xl font-semibold">Trackers</h3>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(data.trackers.stats).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{key}</p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <h4 className="mb-3 text-sm font-medium">Posts by Status</h4>
                <BarChart data={data.trackers.postByStatus} />
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <h4 className="mb-3 text-sm font-medium">Posts by Type</h4>
                <BarChart data={data.trackers.postByType} />
              </div>
            </div>
          </section>

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

          <section id="users" className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-xl font-semibold">Users CRUD</h3>
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
            {data.users.length === 0 ? <p className="text-sm text-slate-300">No users found.</p> : null}
          </section>

          <section id="categories" className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-xl font-semibold">Categories & Subcategories CRUD</h3>
            <form action={upsertCategory} className="grid gap-2 rounded border border-white/10 p-3">
              <input name="categoryId" placeholder="Category ID (for edit)" className="h-9 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
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
          </section>

          <section id="posts" className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-xl font-semibold">Posts CRUD + Rich Text + SEO</h3>
            <form action={upsertPost} className="grid gap-3 rounded border border-white/10 p-4">
              <input name="postId" placeholder="Post ID (for edit)" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
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
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="thumbnailUrl" placeholder="Thumbnail URL (cloud/local)" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
                <input name="videoUrl" placeholder="Video URL (cloud/local)" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" name="isTikTokFeatured" /> Feature in TikTok Creates
              </label>
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
              {data.posts.length === 0 ? <p className="text-sm text-slate-300">No posts found.</p> : null}
            </div>
          </section>

          <section id="daily-tips" className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-xl font-semibold">Daily Tips CRUD</h3>
            <form action={upsertDailyTip} className="grid gap-3 rounded border border-white/10 p-4">
              <input name="tipId" placeholder="Tip ID (for edit)" className="h-10 rounded border border-white/20 bg-slate-900/70 px-3 text-sm" />
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

          <section id="tiktok" className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-xl font-semibold">TikTok Ideas & Videos</h3>
            <p className="mt-2 text-sm text-slate-300">
              Use post form fields <strong>thumbnailUrl</strong>, <strong>videoUrl</strong>, and <strong>Feature in TikTok Creates</strong> to manage TikTok section content.
            </p>
          </section>
        </section>
      </div>
    </main>
  );
}
