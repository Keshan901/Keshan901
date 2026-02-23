import axios from "axios";
import type { ViralItem } from "./types";

export async function fetchFromMetaGraph(): Promise<ViralItem[]> {
  const token = process.env.META_GRAPH_ACCESS_TOKEN;
  if (!token) return [];

  const { data } = await axios.get("https://graph.facebook.com/v21.0/ig_hashtag_search", {
    params: {
      user_id: "me",
      q: "viral",
      access_token: token,
    },
  });

  const hashtags = Array.isArray(data?.data) ? data.data : [];
  return hashtags.slice(0, 10).map((entry: { name: string }, idx: number) => ({
    term: `#${entry.name}`,
    category: "meta-graph",
    usageCount: 2500 - idx * 120,
    engagement: 7.2 + idx * 0.1,
    source: "meta-graph",
  }));
}

export async function fetchFromBuzzSumo(): Promise<ViralItem[]> {
  const key = process.env.BUZZSUMO_API_KEY;
  if (!key) return [];

  const { data } = await axios.get("https://api.buzzsumo.com/search/articles.json", {
    params: {
      q: "facebook viral",
      num_results: 10,
      api_key: key,
    },
  });

  const results = Array.isArray(data?.results) ? data.results : [];
  return results.map((item: { title: string }, idx: number) => ({
    term: item.title.toLowerCase().split(" ").slice(0, 3).join(" "),
    category: "buzzsumo",
    usageCount: 1800 - idx * 90,
    engagement: 6.8 + idx * 0.12,
    source: "buzzsumo",
  }));
}


export async function fetchFromBrandwatch(): Promise<ViralItem[]> {
  const key = process.env.BRANDWATCH_API_KEY;
  if (!key) return [];

  const { data } = await axios.get("https://api.brandwatch.com/projects", {
    headers: { Authorization: `Bearer ${key}` },
  });

  const items = Array.isArray(data?.results) ? data.results : [];
  return items.slice(0, 10).map((item: { name: string }, idx: number) => ({
    term: item.name.toLowerCase(),
    category: "brandwatch",
    usageCount: 1400 - idx * 70,
    engagement: 6.5 + idx * 0.1,
    source: "brandwatch",
  }));
}

export async function fetchFromPublicFallback(): Promise<ViralItem[]> {
  const { data } = await axios.get("https://www.reddit.com/r/marketing/top.json?limit=20&t=day", {
    headers: { "User-Agent": "viral-keyword-tracker/1.0" },
  });

  const posts = data?.data?.children?.map((x: { data: { title: string; score: number } }) => x.data) ?? [];
  return posts.slice(0, 10).map((post: { title: string; score: number }) => {
    const term = post.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(" ")
      .slice(0, 3)
      .join(" ");

    return {
      term,
      category: "public-trend",
      usageCount: Math.max(100, post.score),
      engagement: Number((4 + Math.min(6, post.score / 400)).toFixed(2)),
      source: "reddit-public-api",
    };
  });
}
