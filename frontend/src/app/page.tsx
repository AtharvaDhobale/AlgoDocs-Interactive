import Link from "next/link";
import { BookOpen, Layers, Zap, Eye, Code2, ShieldCheck, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-black">
      {/* Top Banner */}
      <div className="border-b border-cyan-500/20 bg-cyan-950/40 px-4 py-2 text-center text-xs text-cyan-300">
        🚀 <strong>AlgoDocs-Interactive</strong>: Enterprise Technical Documentation & Concept Simplification Platform
      </div>

      <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            <BookOpen className="h-3.5 w-3.5" /> Topic-Based Technical Documentation (Diátaxis Framework)
          </div>
          
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Explaining complex systems in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">plain English</span>.
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            AlgoDocs-Interactive bridges technical writing and developer tooling. By combining <strong>real-life analogies</strong>, <strong>interactive visual traces</strong>, and <strong>rigorous topic-based documentation</strong>, it transforms intimidating algorithms into accessible, customer-centric guides.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/visualizer"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              <Eye className="h-4 w-4" /> Open Interactive Docs Studio
            </Link>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <Code2 className="h-4 w-4" /> Practice IDE (365+ Problems)
            </Link>
          </div>
        </div>

        {/* 3 Pillars of Technical Writing Craft */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur transition hover:border-cyan-500/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">Real-Life Analogy Engine</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Explains abstract computing structures through everyday analogies: LIFO as a cafeteria plate stack, Hash Tables as gym lockers, and Graphs as metro transit networks.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur transition hover:border-teal-500/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
              <Layers className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">Diátaxis Documentation Spec</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Structured documentation following the industry-standard Diátaxis framework: Concepts, Task procedures (How-Tos), API Reference matrices, and failure mode analysis.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur transition hover:border-emerald-500/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">Audience Reading Levels</h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Toggle between three distinct reading tiers: Non-Technical Plain English, Software Engineer Implementation, and Systems Architect hardware constraints.
            </p>
          </div>
        </div>

        {/* Live Demo Preview Callout */}
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/80 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Documentation Experience</span>
            <h3 className="mt-1 text-2xl font-bold text-white">Explore 12 Interactive Data Structures</h3>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              Stack, Queue, Deque, Singly/Doubly Linked List, BST, AVL Self-Balancing Tree, Max Heap, Trie, Chaining & Linear Probing Hash Tables, and Directed Graphs.
            </p>
          </div>
          <Link
            href="/visualizer"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Launch Visualizer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
