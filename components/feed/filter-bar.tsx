import Link from "next/link";
import { PostType } from "@prisma/client";

type CategoryOption = { slug: string; name: string };

type Props = {
  basePath: "/explore" | "/trending";
  query?: string;
  type?: PostType;
  category?: string;
  tag?: string;
  categories: CategoryOption[];
  tags: string[];
};

export function FilterBar({ basePath, query, type, category, tag, categories, tags }: Props) {
  return (
    <form action={basePath} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2 lg:grid-cols-5">
      <input
        name="q"
        defaultValue={query}
        placeholder="Search title/content"
        className="h-10 rounded-md border border-white/15 bg-slate-900/80 px-3 text-sm"
      />

      <select name="type" defaultValue={type ?? ""} className="h-10 rounded-md border border-white/15 bg-slate-900/80 px-3 text-sm">
        <option value="">All Types</option>
        {Object.values(PostType).map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select name="category" defaultValue={category ?? ""} className="h-10 rounded-md border border-white/15 bg-slate-900/80 px-3 text-sm">
        <option value="">All Categories</option>
        {categories.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>

      <select name="tag" defaultValue={tag ?? ""} className="h-10 rounded-md border border-white/15 bg-slate-900/80 px-3 text-sm">
        <option value="">All Tags</option>
        {tags.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button className="h-10 flex-1 rounded-md bg-fuchsia-500 px-3 text-sm font-medium text-white transition hover:bg-fuchsia-400" type="submit">
          Apply
        </button>
        <Link href={basePath} className="flex h-10 flex-1 items-center justify-center rounded-md border border-white/20 text-sm">
          Reset
        </Link>
      </div>
    </form>
  );
}
