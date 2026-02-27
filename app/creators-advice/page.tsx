import { PostType } from "@prisma/client";

import { auth } from "@/auth";
import { EmptyState } from "@/components/feed/empty-state";
import { PostListCard } from "@/components/posts/post-list-card";
import { getPostsByType } from "@/lib/post-queries";

export default async function CreatorsAdvicePage() {
  const session = await auth();
  const posts = await getPostsByType(PostType.ADVICE, session?.user?.id);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-6 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-3xl font-bold">Creators Advice</h1>
        <p className="text-sm text-slate-300">Advice posts for creators with favorite toggles.</p>
      </header>

      {posts.length === 0 ? (
        <EmptyState title="No advice posts yet" description="Advice posts will appear when real content is published." />
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostListCard key={post.id} post={post} canFavorite={Boolean(session?.user?.id)} />
          ))}
        </div>
      )}
    </main>
  );
}
