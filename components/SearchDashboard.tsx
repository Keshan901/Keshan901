"use client";

import { useMemo, useState } from "react";
import { Copy, Search } from "lucide-react";

type Keyword = {
  id: number;
  term: string;
  category: string;
  usageCount: number;
  engagement: number;
  source: string;
};

type Hashtag = {
  id: number;
  tag: string;
  category: string;
  usageCount: number;
  engagement: number;
  trending: boolean;
  source: string;
};

type Formula = {
  id: number;
  title: string;
  template: string;
  contentType: string;
  avgEngagementRate: number;
  category: string;
};

export default function SearchDashboard({
  keywords,
  hashtags,
  formulas,
}: {
  keywords: Keyword[];
  hashtags: Hashtag[];
  formulas: Formula[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [contentType, setContentType] = useState("all");
  const [minEngagement, setMinEngagement] = useState(0);

  const categories = useMemo(() => {
    const all = new Set(["all", ...keywords.map((k) => k.category), ...hashtags.map((h) => h.category), ...formulas.map((f) => f.category)]);
    return [...all];
  }, [keywords, hashtags, formulas]);

  const contentTypes = useMemo(() => {
    const all = new Set(["all", ...formulas.map((f) => f.contentType)]);
    return [...all];
  }, [formulas]);

  const filteredKeywords = keywords.filter((item) => {
    return (
      item.term.toLowerCase().includes(query.toLowerCase()) &&
      (category === "all" || item.category === category) &&
      item.engagement >= minEngagement
    );
  });

  const filteredHashtags = hashtags
    .filter((item) => {
      return (
        item.tag.toLowerCase().includes(query.toLowerCase()) &&
        (category === "all" || item.category === category) &&
        item.engagement >= minEngagement
      );
    })
    .sort((a, b) => b.usageCount - a.usageCount);

  const filteredFormulas = formulas.filter((item) => {
    return (
      (item.title.toLowerCase().includes(query.toLowerCase()) || item.template.toLowerCase().includes(query.toLowerCase())) &&
      (category === "all" || item.category === category) &&
      (contentType === "all" || item.contentType === contentType) &&
      item.avgEngagementRate >= minEngagement
    );
  });

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-brand.deep p-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold">Facebook Viral Keywords Report Explorer</h1>
        <p className="mt-2 text-slate-200">Search keywords, hashtags, and proven content formulas. Data auto-refreshes from multi-provider APIs.</p>
      </section>

      <section className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            placeholder="Search terms, hashtags, formulas"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3"
          />
        </label>

        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2">
          {categories.map((item) => (
            <option value={item} key={item}>
              Category: {item}
            </option>
          ))}
        </select>

        <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2">
          {contentTypes.map((item) => (
            <option value={item} key={item}>
              Content type: {item}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm">
          Min Engagement
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={minEngagement}
            onChange={(e) => setMinEngagement(Number(e.target.value))}
            className="w-20 rounded-md border border-slate-300 px-2 py-1"
          />
        </label>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-brand.deep">Top Trending Hashtags</h2>
          <div className="flex gap-2 text-xs">
            <a href="/api/export?type=hashtags" className="rounded border bg-white px-2 py-1">Export Hashtags CSV</a>
            <a href="/api/export?type=formulas" className="rounded border bg-white px-2 py-1">Export Formulas CSV</a>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredHashtags.slice(0, 10).map((item) => (
            <article key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{item.tag}</h3>
                <button onClick={() => copyText(item.tag)} className="rounded p-1 hover:bg-slate-100" title="Copy hashtag">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600">Usage: {item.usageCount.toLocaleString()} · Engagement: {item.engagement}%</p>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="rounded bg-slate-100 px-2 py-1">{item.category}</span>
                {(item.trending || item.engagement >= 8.5 || filteredHashtags.indexOf(item) < 10) && <span className="rounded bg-brand.light px-2 py-1 text-brand.deep">🔥 Trending</span>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-brand.deep">Viral Keywords</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredKeywords.map((item) => (
            <article key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="font-semibold">{item.term}</h3>
              <p className="mt-2 text-sm text-slate-600">Usage: {item.usageCount.toLocaleString()} · Engagement: {item.engagement}%</p>
              <p className="mt-1 text-xs text-slate-500">Source: {item.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-brand.deep">Content Formulas</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredFormulas.map((item) => (
            <article key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{item.title}</h3>
                <button onClick={() => copyText(item.template)} className="rounded p-1 hover:bg-slate-100" title="Copy formula template">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.template}</p>
              <p className="mt-2 text-xs text-slate-500">
                Type: {item.contentType} · Avg engagement: {item.avgEngagementRate}%
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
