"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Brain, Code2, Trophy, Play, Sun, Moon, BarChart2, Flame, CheckCircle2 } from "lucide-react";

const modules = [
  {
    title: "Visualize DSA",
    description: "Watch arrays, stacks, queues, trees and graphs come to life. Includes real-life analogies so concepts actually make sense.",
    icon: Play,
    href: "/visualizer",
    badge: "12 structures",
  },
  {
    title: "Practice Problems",
    description: "365+ questions organized by topic and difficulty. Each problem has a built-in step debugger so you can see exactly what your code does.",
    icon: Code2,
    href: "/practice",
    badge: "365+ questions",
  },
  {
    title: "Study Roadmap",
    description: "Curated learning tracks — Foundation, FAANG Prep, or Competitive Programming. Check off topics as you go, progress saves automatically.",
    icon: Brain,
    href: "/roadmap",
    badge: "3 tracks",
  },
];

const stats = [
  { label: "Questions solved", value: "12", icon: CheckCircle2 },
  { label: "Visualizations viewed", value: "8", icon: BarChart2 },
  { label: "Day streak", value: "4", icon: Flame },
];

export default function DashboardPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("light", saved === "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">AlgoVision</p>
            <h1 className="mt-1 text-2xl font-bold">Welcome back 👋</h1>
            <p className="mt-1 text-sm text-muted">Pick up where you left off, or explore something new.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 border border-border rounded-xl bg-card hover:bg-primary/5 transition cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark"
                ? <Sun className="h-4 w-4 text-yellow-400" />
                : <Moon className="h-4 w-4 text-indigo-500" />
              }
            </button>
            <Link
              href="/"
              className="text-xs px-4 py-2.5 rounded-xl border border-border bg-card text-muted hover:text-foreground transition font-semibold"
            >
              Home
            </Link>
          </div>
        </header>

        {/* Stats row */}
        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-xs text-muted mt-0.5">{item.label}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main modules */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm">Where to go</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={mod.title}
                  href={mod.href}
                  className="group rounded-3xl border border-border bg-card p-5 flex flex-col gap-4 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                      {mod.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{mod.title}</h3>
                    <p className="mt-1.5 text-xs text-muted leading-relaxed">{mod.description}</p>
                  </div>
                  <span className="text-xs text-primary font-semibold mt-auto group-hover:translate-x-0.5 transition-transform">
                    Open →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Today's goal */}
        <section className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-accent/5 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-primary" />
            <h2 className="font-bold text-sm">Today's suggestion</h2>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Try inserting a few values into the BST visualizer and watch the step-by-step trace explain each comparison. Then pick one Easy problem from the practice page to reinforce it with code.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/visualizer" className="text-xs px-4 py-2 rounded-xl bg-primary text-slate-950 font-bold hover:opacity-90 transition">
              Open Visualizer
            </Link>
            <Link href="/practice" className="text-xs px-4 py-2 rounded-xl border border-border bg-card text-foreground font-bold hover:bg-primary/5 transition">
              Solve a Problem
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
