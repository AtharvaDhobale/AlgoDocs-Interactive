"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple",
  "Atlassian", "Adobe", "Oracle", "Goldman Sachs", "Netflix",
];

export function CompaniesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-16 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8" ref={ref}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center text-sm text-gray-400 mb-8"
        >
          Trusted by learners preparing for top companies
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company, i) => (
            <motion.span
              key={company}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 0.5, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              whileHover={{ opacity: 1 }}
              className="text-lg font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-default"
            >
              {company}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const testimonials = [
    {
      quote: "AlgoVision's AVL tree rotations finally made balancing click for me. The step-by-step pointer tracking is incredible.",
      author: "Priya Sharma",
      role: "SDE @ Amazon",
      avatar: "PS",
    },
    {
      quote: "The AI tutor doesn't just give answers — it guides you to think. My interview readiness score went from 45 to 87 in 3 months.",
      author: "Rahul Verma",
      role: "SWE @ Google",
      avatar: "RV",
    },
    {
      quote: "Comparison mode for sorting algorithms is a game-changer. Seeing bubble vs quicksort side-by-side with real metrics — brilliant.",
      author: "Ananya Patel",
      role: "Intern @ Microsoft",
      avatar: "AP",
    },
  ];

  return (
    <section className="py-32 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <Badge variant="gradient" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Loved by <span className="gradient-text">50,000+ learners</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white p-8 shadow-card border border-gray-100"
            >
              <p className="text-gray-600 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-medium">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.author}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
