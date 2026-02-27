"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = ["Explore", "Trending Contents", "Creators", "TikTok Creates"];

const sections = [
  {
    title: "Discover what’s working now",
    description:
      "Explore data-backed ideas, proven hooks, and formats that creators use to grow faster on short-form platforms.",
    badge: "Explore"
  },
  {
    title: "Trending contents at a glance",
    description:
      "Track rising categories and themes so you can produce the right content before the trend peaks.",
    badge: "Trending Contents"
  },
  {
    title: "Creator-first strategy hub",
    description:
      "From solo creators to growing teams, access practical workflows that balance creativity and consistency.",
    badge: "Creators"
  },
  {
    title: "TikTok creates, simplified",
    description:
      "Learn repeatable systems for scripting, editing, posting, and iterating without burning out.",
    badge: "TikTok Creates"
  },
  {
    title: "Daily tips you can apply instantly",
    description:
      "Actionable advice shipped every day, tailored to the creator economy and short-form storytelling.",
    badge: "Daily Tips"
  },
  {
    title: "Build your publishing engine",
    description:
      "Turn scattered ideas into a predictable publishing cadence with content calendars and smart repurposing.",
    badge: "Workflow"
  },
  {
    title: "Measure, learn, and improve",
    description:
      "Identify what truly performs with lightweight tracking and transparent signals that guide your next move.",
    badge: "Analytics"
  },
  {
    title: "Join the next wave of creators",
    description:
      "Sign in to unlock personalized recommendations, save favorites, and collaborate with your creator team.",
    badge: "Get Started"
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
      delay: index * 0.08
    }
  })
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="hidden w-1/3 md:block" />

          <Link href="/" className="w-full text-center text-lg font-semibold tracking-wide md:w-1/3">
            Keshan<span className="text-fuchsia-400">901</span>
          </Link>

          <div className="hidden w-1/3 items-center justify-end gap-6 md:flex">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-slate-300 transition hover:text-white">
                {link}
              </a>
            ))}
            <Link
              href="/login"
              className="rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-fit rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-1 text-sm text-fuchsia-300"
          >
            Creator intelligence platform
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            Build content that gets seen, shared, and remembered.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.16 }}
            className="max-w-2xl text-base text-slate-300 sm:text-lg"
          >
            A responsive, creator-focused landing experience with motion-powered storytelling and practical calls to action.
          </motion.p>
        </section>

        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-20 sm:px-6 lg:px-8">
          {sections.map((section, index) => (
            <motion.section
              id={section.badge.toLowerCase().replace(/\s+/g, "-")}
              key={section.title}
              custom={index}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 shadow-xl shadow-black/20 sm:p-8"
            >
              <span className="mb-4 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200">
                Section {index + 1}: {section.badge}
              </span>
              <h2 className="text-2xl font-semibold sm:text-3xl">{section.title}</h2>
              <p className="mt-3 max-w-3xl text-slate-300">{section.description}</p>
            </motion.section>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Keshan901. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#explore" className="hover:text-slate-200">
              Explore
            </a>
            <a href="#trending-contents" className="hover:text-slate-200">
              Trending
            </a>
            <a href="#creators" className="hover:text-slate-200">
              Creators
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
