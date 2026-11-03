"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2 } from "lucide-react";

const roadmapSteps = [
  { title: "Arrays & Strings", status: "completed", topics: 12 },
  { title: "Linked Lists", status: "completed", topics: 8 },
  { title: "Stacks & Queues", status: "completed", topics: 10 },
  { title: "Trees & BST", status: "current", topics: 15 },
  { title: "Graphs", status: "locked", topics: 18 },
  { title: "Dynamic Programming", status: "locked", topics: 22 },
  { title: "Advanced Algorithms", status: "locked", topics: 20 },
];

export function RoadmapSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="roadmap" className="py-32" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <Badge variant="gradient" className="mb-4">Learning Roadmap</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your personalized path to{" "}
            <span className="gradient-text">mastery</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            AI-generated roadmaps that adapt to your progress, lock topics until prerequisites are met, and recommend what to learn next.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {roadmapSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 mb-2"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step.status === "completed"
                      ? "bg-indigo-500 border-indigo-500 text-white"
                      : step.status === "current"
                      ? "border-indigo-500 text-indigo-500 bg-indigo-50"
                      : "border-gray-200 text-gray-300 bg-gray-50"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : step.status === "locked" ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </div>
                {i < roadmapSteps.length - 1 && (
                  <div
                    className={`w-0.5 h-8 ${
                      step.status === "completed" ? "bg-indigo-300" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div className={`pb-6 flex-1 ${step.status === "locked" ? "opacity-50" : ""}`}>
                <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{step.topics} topics</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VisualizePreviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const structures = [
    "Array", "Linked List", "Stack", "Queue", "BST",
    "AVL Tree", "Heap", "Hash Table", "Graph", "Trie",
    "Segment Tree", "Red-Black Tree",
  ];

  return (
    <section id="visualize" className="py-32 bg-gray-50/50" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <Badge variant="gradient" className="mb-4">Visualization Engine</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            30+ data structures,{" "}
            <span className="gradient-text">beautifully animated</span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {structures.map((ds, i) => (
            <motion.div
              key={ds}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-100 shadow-soft text-sm font-medium text-gray-700 hover:border-indigo-200 hover:text-indigo-600 cursor-pointer transition-all"
            >
              {ds}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-32" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="mx-auto max-w-4xl px-6 text-center"
      >
        <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 p-12 sm:p-16 shadow-elevated">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to master algorithms?
          </h2>
          <p className="mt-4 text-indigo-100 text-lg max-w-lg mx-auto">
            Join 50,000+ learners visualizing, practicing, and preparing for their dream companies.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="inline-flex h-12 items-center px-8 rounded-xl bg-white text-indigo-600 font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Get Started Free
            </a>
            <a
              href="#features"
              className="inline-flex h-12 items-center px-8 rounded-xl border border-white/30 text-white font-medium hover:bg-white/10 transition-all"
            >
              Explore Features
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
