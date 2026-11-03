"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    q: "What makes AlgoVision different from other DSA visualizers?",
    a: "AlgoVision combines advanced animations with AI tutoring, gamification, interview prep, and a full code playground. It's not just a visualizer — it's a complete learning ecosystem designed for placement preparation.",
  },
  {
    q: "Which programming languages are supported in the code playground?",
    a: "Java, Python, C++, and JavaScript are supported with compile, run, debug, and step-by-step execution animation with variable inspection.",
  },
  {
    q: "How does the AI Tutor work?",
    a: "The AI Tutor provides contextual explanations, hints, and quizzes based on what you're learning. It guides your thinking rather than giving direct answers, unless you explicitly request them.",
  },
  {
    q: "Can teachers use AlgoVision for their classes?",
    a: "Yes! The Teacher Dashboard lets educators create assignments, build visual quizzes, monitor student progress, and access class-wide analytics.",
  },
  {
    q: "Is there a free plan?",
    a: "Absolutely. The free plan includes 10 data structure visualizations, basic sorting algorithms, 50 practice problems, and community access — enough to get started.",
  },
  {
    q: "Does it work on mobile devices?",
    a: "The platform is fully responsive. Visualizations and the code playground work on tablets, though we recommend desktop for the best experience.",
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-32 bg-gray-50/50" ref={ref}>
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <Badge variant="gradient" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-soft overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const links = {
    Product: ["Features", "Visualize", "Pricing", "Roadmap"],
    Resources: ["Documentation", "Blog", "Community", "Changelog"],
    Company: ["About", "Careers", "Contact", "Privacy"],
  };

  return (
    <footer className="border-t border-gray-100 bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-lg font-semibold">
              Algo<span className="gradient-text">Vision</span> AI
            </span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Interactive DSA learning platform for the next generation of engineers.
            </p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">&copy; 2026 AlgoVision AI. All rights reserved.</p>
          <p className="text-xs text-gray-400">Built for B.Tech Final Year Project &middot; Module 1</p>
        </div>
      </div>
    </footer>
  );
}
