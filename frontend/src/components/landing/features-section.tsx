"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Eye,
  Bot,
  Code2,
  Trophy,
  BarChart3,
  Users,
  Brain,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Eye,
    title: "Advanced Visualization",
    description:
      "30+ data structures with step-by-step animations, pointer tracking, memory visualization, and undo/redo.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Bot,
    title: "AI Tutor",
    description:
      "Context-aware explanations, personalized hints, quiz generation, and interview question prep — never spoon-feeds answers.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Code2,
    title: "Code Playground",
    description:
      "Monaco editor with Java, Python, C++, and JavaScript. Compile, run, debug, and watch execution animate.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description:
      "Earn XP, level up, collect badges, maintain streaks, and compete on leaderboards while mastering DSA.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Learning heatmaps, weak topic detection, interview readiness scores, and personalized roadmaps.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "Real-time whiteboard, code sharing, communities, and peer learning with live visualization sharing.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Brain,
    title: "Interview Mode",
    description:
      "Timed sessions with whiteboard, compiler, AI feedback on communication and complexity analysis.",
    gradient: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "Comparison Mode",
    description:
      "Side-by-side algorithm performance comparison with execution time, memory usage, and complexity charts.",
    gradient: "from-indigo-500 to-violet-500",
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-32" ref={ref}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="gradient" className="mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Everything you need to{" "}
            <span className="gradient-text">study with confidence</span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Simple tools, clear explanations, and practice that feels easy to follow.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="h-full hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 border-gray-100">
                <CardHeader>
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-md mb-2`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
