"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const section = "my-12";

export default function HomePage() {
  return (
    <div>
      <section className={section}>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold">Turn trends into growth with ViralVault.</motion.h1>
        <p className="mt-3 text-zinc-300">Find viral keywords + hashtags, save sets, and get daily content tips.</p>
        <div className="mt-5 flex gap-3">
          <Link href="/signup"><Button variant="gradient">Get Started</Button></Link>
          <Link href="/explore"><Button variant="outline">Explore</Button></Link>
        </div>
      </section>

      <section className={section}><Card><h2 className="text-2xl font-semibold">Trusted by 12k+ creators</h2><p>4.9/5 average satisfaction • 2.1M copies last month.</p></Card></section>
      <section className={section}><div className="grid gap-4 md:grid-cols-3">{["Discover", "Customize", "Publish"].map((s, i) => <Card key={s}><h3 className="font-semibold">{i + 1}. {s}</h3><p>Optimized for multi-platform content pipelines.</p></Card>)}</div></section>
      <section className={section}><h2 className="mb-4 text-2xl font-semibold">Trending Keywords</h2><div className="grid gap-4 md:grid-cols-3">{[1,2,3].map((n)=> <Card key={n}>AI side hustle, travel hacks, skincare routine <Button size="sm" className="mt-3">Copy</Button></Card>)}</div></section>
      <section className={section}><Card><h2 className="text-2xl font-semibold">Daily Tips Carousel</h2><p>Learn hooks, retention strategies, and CTA patterns every day.</p></Card></section>
      <section className={section}><Card><h2 className="text-2xl font-semibold">Become a Creator</h2><p>Publish public sets and build authority.</p><Link href="/become-a-creator"><Button className="mt-3">Apply Now</Button></Link></Card></section>
      <section className={section}><Card><h2 className="text-2xl font-semibold">Daily Watch</h2><p>News and creator briefs curated for velocity.</p><Link href="/daily-watch"><Button className="mt-3" variant="outline">Read Feed</Button></Link></Card></section>
      <section className={section}><Card><h2 className="text-2xl font-semibold">FAQ & Final CTA</h2><p>Need more reach? ViralVault gives structure to your content experimentation.</p><Link href="/signup"><Button className="mt-3" variant="gradient">Start Free</Button></Link></Card></section>
    </div>
  );
}
