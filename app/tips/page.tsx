const tips = [
  {
    formula: "Problem → Agitate → Solve",
    postingTime: "Tue–Thu, 9:00 AM to 11:00 AM local time",
    strategy: "Use a painful audience-specific opening sentence in the first two lines, then include one concrete mini case study before the solution CTA.",
  },
  {
    formula: "Hook → Story → Offer",
    postingTime: "Mon, Wed, Fri at 12:00 PM and 7:00 PM",
    strategy: "Open with a counter-intuitive claim, keep the story short (under 90 seconds for video), and close with one low-friction ask such as comment keyword.",
  },
  {
    formula: "Before → After → Bridge",
    postingTime: "Weekdays at 8:30 AM or 6:30 PM",
    strategy: "Show clear visual proof of before/after outcomes and list bridge steps as numbered bullets so users can save and share.",
  },
];

export default function TipsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-brand.deep p-6 text-white">
        <h1 className="text-3xl font-bold">Content Tips & Engagement Playbook</h1>
        <p className="mt-2 text-slate-200">Actionable guidance for using each viral formula effectively, including best posting times and engagement strategy notes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <article key={tip.formula} className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-brand.deep">{tip.formula}</h2>
            <p className="mt-3 text-sm text-slate-700">
              <span className="font-semibold">Best posting time:</span> {tip.postingTime}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <span className="font-semibold">Engagement strategy:</span> {tip.strategy}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
