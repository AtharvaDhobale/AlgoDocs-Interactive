import Link from "next/link";
import { BookOpen, Layers, Zap, Eye, Code2, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Terminal } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Banner */}
      <div className="border-b border-indigo-100 bg-indigo-50/80 px-4 py-2 text-center text-xs font-medium text-indigo-900">
        ✨ <strong>AlgoDocs-Interactive</strong>: Enterprise Technical Documentation & Concept Simplification Platform
      </div>

      {/* Navigation Header */}
      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-extrabold text-base shadow-sm">
              AD
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight">AlgoDocs-Interactive</span>
              <span className="hidden sm:inline-block ml-2 rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                Docs-as-Code Engine
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/visualizer"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Interactive Studio
            </Link>
            <Link
              href="/practice"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Practice IDE (365+)
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200 py-20 lg:py-24">
        {/* Subtle background gradient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(255,255,255,0))]" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700">
              <BookOpen className="h-3.5 w-3.5" /> Topic-Based Technical Documentation (Diátaxis Framework)
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Explaining complex systems in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">plain English</span>.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              AlgoDocs-Interactive bridges technical writing and developer tooling. By combining <strong>concrete real-life analogies</strong>, <strong>interactive visual state traces</strong>, and <strong>structured topic documentation</strong>, it transforms intimidating computing abstractions into accessible, customer-centric guides.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/visualizer"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
              >
                <Eye className="h-4 w-4" /> Open Interactive Docs Studio
              </Link>
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Code2 className="h-4 w-4" /> Practice IDE & Debugger
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Diátaxis Framework Compliant</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 12 Interactive Data Structures</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> 3-Tier Audience Reading Levels</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards: 3 Pillars */}
      <section className="py-16 lg:py-20 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Editorial Engineering</h2>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">Crafted for clear technical communication</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-indigo-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">Real-Life Analogy Engine</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Explains abstract computing structures through everyday physical systems: LIFO as a cafeteria plate stack, Hash Tables as gym lockers, and Graphs as metro rail networks.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-indigo-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">Diátaxis Documentation Spec</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Structured documentation following the industry-standard Diátaxis framework: Concepts, Task procedures (How-Tos), API Reference matrices, and failure mode analysis.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md hover:border-indigo-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">Audience Reading Levels</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Toggle between three distinct reading tiers: Non-Technical Plain English (analogies), Software Engineer Implementation (API contracts), and Systems Architect (cache locality).
            </p>
          </div>
        </div>

        {/* Live Demo Banner */}
        <div className="mt-14 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-sky-50 p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Interactive Learning Workbench</span>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">Ready to test step-by-step algorithms?</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Explore live insertion traces, self-balancing AVL rotations, heap bubble-ups, and hash collision chaining in an interactive visual sandbox.
            </p>
          </div>
          <Link
            href="/visualizer"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Launch Visualizer Studio <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 lg:px-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>AlgoDocs-Interactive — Designed & Engineered by <strong>Atharva Dhobale</strong></p>
          <div className="flex gap-6 font-medium">
            <Link href="/visualizer" className="hover:text-slate-900">Studio</Link>
            <Link href="/practice" className="hover:text-slate-900">IDE</Link>
            <Link href="/roadmap" className="hover:text-slate-900">Roadmap</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
