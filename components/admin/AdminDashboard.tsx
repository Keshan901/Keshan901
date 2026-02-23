"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Tab = "overview" | "users" | "settings" | "apis" | "hashtags" | "keywords" | "tips" | "formulas";

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
      keywords: "/api/admin/keywords",
      tips: "/api/admin/tips",
      formulas: "/api/admin/formulas",
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
        {(["overview", "users", "settings", "apis", "hashtags", "keywords", "tips", "formulas"] as Tab[]).map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`rounded px-3 py-2 text-sm ${tab === item ? "bg-brand.deep text-white" : "bg-white border"}`}>
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview data={data} />}
      {tab === "users" && <DataTable rows={data.users ?? []} columns={["email", "name", "role", "isActive"]} />}
      {tab === "settings" && <SettingsCrud rows={data.settings ?? []} reload={() => load("settings")} />}
      {tab === "apis" && <ApiCrud rows={data.apis ?? []} reload={() => load("apis")} />}
      {tab === "hashtags" && <HashtagCrud rows={data.hashtags ?? []} reload={() => load("hashtags")} />}
      {tab === "keywords" && <KeywordCrud rows={data.keywords ?? []} reload={() => load("keywords")} />}
      {tab === "tips" && <TipCrud rows={data.tips ?? []} reload={() => load("tips")} />}
      {tab === "formulas" && <FormulaCrud rows={data.formulas ?? []} reload={() => load("formulas")} />}
    </section>
  );
}

function Overview({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        {Object.entries(data.stats ?? {}).map(([k, v]) => (
          <article key={k} className="rounded border bg-white p-4"><p className="text-xs text-slate-500">{k}</p><p className="text-2xl font-bold">{String(v)}</p></article>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="h-72 rounded border bg-white p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={(data.events ?? []).slice(0, 12).map((e: any) => ({ name: e.entityType, engagement: e.engagement }))}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="engagement" fill="#0ea5a4" /></BarChart>
          </ResponsiveContainer>
        </article>
        <RealtimeAnalytics />
      </div>
    </div>
  );
}

function DataTable({ rows, columns }: { rows: any[]; columns: string[] }) {
  return <Table rows={rows} columns={columns} />;
}

function Table({ rows, columns }: { rows: any[]; columns: string[] }) {
  return (
    <div className="overflow-x-auto rounded border bg-white"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr>{columns.map((c) => <th key={c} className="border-b px-3 py-2 text-left">{c}</th>)}</tr></thead><tbody>{rows.map((r, idx) => <tr key={idx}>{columns.map((c) => <td key={c} className="border-b px-3 py-2">{String(r[c] ?? "")}</td>)}</tr>)}</tbody></table></div>
  );
}

function CrudShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="space-y-3"><h3 className="font-semibold text-brand.deep">{title}</h3>{children}</div>;
}

function SettingsCrud({ rows, reload }: { rows: any[]; reload: () => void }) {
  return <CrudShell title="Site Settings"><Table rows={rows} columns={["key", "value", "updatedBy"]} /><SimpleForm fields={["key", "value"]} onSubmit={async (payload) => { await fetch("/api/admin/settings", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }); reload(); }} /></CrudShell>;
}

function ApiCrud({ rows, reload }: { rows: any[]; reload: () => void }) {
  return <CrudShell title="API Keys & Placeholders"><Table rows={rows} columns={["provider", "enabled", "lastStatus", "lastTested"]} /><SimpleForm fields={["provider", "apiKey", "apiSecret", "baseUrl", "enabled"]} onSubmit={async (payload) => { payload.enabled = String(payload.enabled).toLowerCase() === "true"; await fetch("/api/admin/apis", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }); reload(); }} /><button className="rounded border px-3 py-1" onClick={async()=>{await fetch('/api/admin/apis',{method:'POST'});}}>Test Fetch</button></CrudShell>;
}

function HashtagCrud({ rows, reload }: { rows: any[]; reload: () => void }) {
  return <CrudShell title="Hashtags CRUD"><Table rows={rows} columns={["id", "tag", "category", "usageCount", "engagement"]} /><SimpleForm fields={["id", "tag", "category", "usageCount", "engagement", "source"]} onSubmit={async (payload) => { if (payload.id) await fetch('/api/admin/hashtags',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); else await fetch('/api/admin/hashtags',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); reload(); }} /><DeleteRow endpoint="/api/admin/hashtags" reload={reload} /></CrudShell>;
}

function KeywordCrud({ rows, reload }: { rows: any[]; reload: () => void }) {
  return <CrudShell title="Keywords CRUD"><Table rows={rows} columns={["id", "term", "category", "usageCount", "engagement", "source"]} /><SimpleForm fields={["id", "term", "category", "usageCount", "engagement", "source"]} onSubmit={async (payload) => { if (payload.id) await fetch('/api/admin/keywords',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); else await fetch('/api/admin/keywords',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); reload(); }} /><DeleteRow endpoint="/api/admin/keywords" reload={reload} /></CrudShell>;
}

function TipCrud({ rows, reload }: { rows: any[]; reload: () => void }) {
  return <CrudShell title="Tips CRUD"><Table rows={rows} columns={["id", "formula", "postingTime", "strategy"]} /><SimpleForm fields={["id", "formula", "postingTime", "strategy"]} onSubmit={async (payload) => { if (payload.id) await fetch('/api/admin/tips',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); else await fetch('/api/admin/tips',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); reload(); }} /><DeleteRow endpoint="/api/admin/tips" reload={reload} /></CrudShell>;
}

function FormulaCrud({ rows, reload }: { rows: any[]; reload: () => void }) {
  return <CrudShell title="Formulas CRUD"><Table rows={rows} columns={["id", "title", "contentType", "category", "avgEngagementRate"]} /><SimpleForm fields={["id", "title", "template", "contentType", "category", "avgEngagementRate"]} onSubmit={async (payload) => { if (payload.id) await fetch('/api/admin/formulas',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); else await fetch('/api/admin/formulas',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); reload(); }} /><DeleteRow endpoint="/api/admin/formulas" reload={reload} /></CrudShell>;
}

function DeleteRow({ endpoint, reload }: { endpoint: string; reload: () => void }) {
  const [id, setId] = useState("");
  return <div className="flex gap-2"><input value={id} onChange={(e)=>setId(e.target.value)} placeholder="id to delete" className="rounded border px-2 py-1"/><button className="rounded border px-3 py-1" onClick={async()=>{if(!id)return; await fetch(`${endpoint}?id=${id}`,{method:'DELETE'}); setId(''); reload();}}>Delete</button></div>;
}

function SimpleForm({ fields, onSubmit }: { fields: string[]; onSubmit: (payload: Record<string, any>) => Promise<void> }) {
  const [form, setForm] = useState<Record<string, any>>({});
  return <div className="flex flex-wrap gap-2">{fields.map((f) => <input key={f} placeholder={f} value={form[f] ?? ""} className="rounded border px-2 py-1" onChange={(e) => setForm({ ...form, [f]: e.target.value })} />)}<button className="rounded border px-3 py-1" onClick={async ()=>{await onSubmit(form); setForm({});}}>Save</button></div>;
}

function RealtimeAnalytics() {
  const [chart, setChart] = useState<any[]>([]);
  useEffect(() => { fetch("/api/admin/analytics").then((r) => r.ok ? r.json() : { chart: [] }).then((d) => setChart(d.chart ?? [])); }, []);
  return <article className="h-72 rounded border bg-white p-3"><ResponsiveContainer width="100%" height="100%"><LineChart data={chart.slice(-20)}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="engagement" stroke="#0b2545" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></article>;
}
