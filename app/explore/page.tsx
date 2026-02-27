import { EmptyState } from "@/components/feed/empty-state";
import { FilterBar } from "@/components/feed/filter-bar";
import { PostCard } from "@/components/feed/post-card";
import { getExplorePosts, getFilterOptions, normalizeFilters } from "@/lib/feeds";

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters = normalizeFilters(params);
  const [options, posts] = await Promise.all([getFilterOptions(), getExplorePosts(filters)]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold">Explore</h1>
        <p className="text-sm text-slate-300">Search and filter by post type, category, and tags.</p>
      </header>

      <FilterBar
        basePath="/explore"
        query={filters.query}
        type={filters.type}
        category={filters.category}
        tag={filters.tag}
        categories={options.categories}
        tags={options.tags}
      />

      {posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="There are no published posts matching your filters yet."
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
