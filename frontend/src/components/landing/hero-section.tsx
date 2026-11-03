"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Zap, Brain, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroBackground, FloatingDataStructures } from "./hero-background";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      <HeroBackground />
      <FloatingDataStructures />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="gradient" className="mb-6">
              <Zap className="h-3 w-3 mr-1" />
              Simple DSA Learning for Students
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]"
          >
            Learn DSA the <span className="gradient-text">easy way</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl leading-relaxed"
          >
            A calm, simple place to learn data structures and algorithms step by step.
            Clear visuals, guided practice, and friendly support — all in one easy workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/signup">
              <Button size="lg">
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#visualize">
              <Button variant="secondary" size="lg">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 gap-8 sm:gap-16"
          >
            {[
              { icon: Brain, label: "AI Tutor", desc: "Personalized hints" },
              { icon: Code2, label: "Playground", desc: "Run & debug code" },
              { icon: Zap, label: "30+ DS", desc: "Live animations" },
            ].map((item, i) => (
              <div key={item.label} className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 shadow-soft">
                  <item.icon className="h-5 w-5 text-indigo-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
                <span className="text-xs text-gray-400">{item.desc}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero visualization preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 mx-auto max-w-5xl"
        >
          <div className="gradient-border rounded-2xl p-1 shadow-elevated">
            <div className="rounded-[11px] bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <span className="text-xs text-gray-400 ml-2">AVL Tree — Insert Operation</span>
              </div>
              <div className="p-8 min-h-[280px] flex items-center justify-center bg-gradient-to-b from-white to-gray-50/30">
                <AVLTreePreview />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AVLTreePreview() {
  const nodes = [
    { val: 30, x: 50, y: 10, highlight: false },
    { val: 20, x: 25, y: 40, highlight: false },
    { val: 40, x: 75, y: 40, highlight: false },
    { val: 25, x: 37, y: 70, highlight: true },
  ];

  return (
    <svg viewBox="0 0 100 85" className="w-full max-w-md">
      <motion.line x1="50" y1="18" x2="25" y2="33" stroke="#e5e7eb" strokeWidth="0.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
      <motion.line x1="50" y1="18" x2="75" y2="33" stroke="#e5e7eb" strokeWidth="0.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.9 }} />
      <motion.line x1="25" y1="47" x2="37" y2="63" stroke="#6366f1" strokeWidth="0.8"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.2 }} />
      {nodes.map((node, i) => (
        <motion.g key={node.val}
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 + i * 0.15, type: "spring" }}>
          <circle cx={node.x} cy={node.y} r="7"
            fill={node.highlight ? "#6366f1" : "white"}
            stroke={node.highlight ? "#6366f1" : "#d1d5db"} strokeWidth="0.8" />
          <text x={node.x} y={node.y + 1.5} textAnchor="middle" fontSize="4.5"
            fill={node.highlight ? "white" : "#374151"} fontWeight="600">{node.val}</text>
        </motion.g>
      ))}
    </svg>
  );
}
