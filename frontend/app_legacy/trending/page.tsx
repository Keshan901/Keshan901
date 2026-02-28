import { EmptyState } from "@/components/feed/empty-state";
import { FilterBar } from "@/components/feed/filter-bar";
import { PostCard } from "@/components/feed/post-card";
import { getFilterOptions, getTrendingPosts, normalizeFilters } from "@/lib/feeds";

export default async function TrendingPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = normalizeFilters(params);
  const [options, posts] = await Promise.all([getFilterOptions(), getTrendingPosts(filters)]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold">Trending</h1>
        <p className="text-sm text-slate-300">
          Ranked by views + favorites + recency. Only real published content is shown.
        </p>
      </header>

      <FilterBar
        basePath="/trending"
        query={filters.query}
        type={filters.type}
        category={filters.category}
        tag={filters.tag}
        categories={options.categories}
        tags={options.tags}
      />

      {posts.length === 0 ? (
        <EmptyState
          title="No trending posts yet"
          description="There is no uploaded content yet. Trending will appear automatically once real posts exist."
        />
      ) : (
        <div className="grid gap-4">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}
