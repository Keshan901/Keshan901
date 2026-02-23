"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Tab = "overview" | "users" | "settings" | "apis" | "hashtags";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<any>({});

  async function load(t: Tab) {
    const map: Record<Tab, string> = {
      overview: "/api/admin/overview",
      users: "/api/admin/users",
      settings: "/api/admin/settings",
      apis: "/api/admin/apis",
      hashtags: "/api/admin/hashtags",
    };
    const res = await fetch(map[t]);
    if (res.ok) setData(await res.json());
  }

  useEffect(() => {
    load(tab);
  }, [tab]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["overview", "users", "settings", "apis", "hashtags"] as Tab[]).map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`rounded px-3 py-2 text-sm ${tab === item ? "bg-brand.deep text-white" : "bg-white border"}`}>
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            {Object.entries(data.stats ?? {}).map(([k, v]) => (
              <article key={k} className="rounded border bg-white p-4"><p className="text-xs text-slate-500">{k}</p><p className="text-2xl font-bold">{String(v)}</p></article>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <article className="h-72 rounded border bg-white p-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(data.events ?? []).slice(0, 12).map((e: any) => ({ name: e.entityType, engagement: e.engagement }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="engagement" fill="#0ea5a4" />
                </BarChart>
              </ResponsiveContainer>
            </article>
            <RealtimeAnalytics />
          </div>
        </div>
      )}

      {tab === "users" && <DataTable rows={data.users ?? []} columns={["email", "name", "role", "isActive"]} />}
      {tab === "settings" && <DataTable rows={data.settings ?? []} columns={["key", "value", "updatedBy"]} />}
      {tab === "apis" && <DataTable rows={data.apis ?? []} columns={["provider", "enabled", "lastStatus", "lastTested"]} />}
      {tab === "hashtags" && <DataTable rows={data.hashtags ?? []} columns={["tag", "category", "usageCount", "engagement"]} />}
    </section>
  );
}

function DataTable({ rows, columns }: { rows: any[]; columns: string[] }) {
  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50"><tr>{columns.map((c) => <th key={c} className="border-b px-3 py-2 text-left">{c}</th>)}</tr></thead>
        <tbody>{rows.map((r, idx) => <tr key={idx}>{columns.map((c) => <td key={c} className="border-b px-3 py-2">{String(r[c] ?? "")}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function RealtimeAnalytics() {
  const [chart, setChart] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/analytics").then((r) => r.ok ? r.json() : { chart: [] }).then((d) => setChart(d.chart ?? []));
  }, []);

  return (
    <article className="h-72 rounded border bg-white p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart.slice(-20)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="engagement" stroke="#0b2545" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </article>
  );
}
