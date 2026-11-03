"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Award, Compass, Brain, Code2, Play, Sun, Moon, CheckSquare, Square, CheckCircle } from "lucide-react";

interface TopicCheckbox {
  id: string;
  label: string;
  completed: boolean;
}

interface Milestone {
  id: string;
  title: string;
  desc: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  color: string;
  subTopics: TopicCheckbox[];
}

export default function RoadmapPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedTrack, setSelectedTrack] = useState<"faang" | "foundation" | "competitive">("faang");
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>("arrays-basics");

  // State milestones list
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Sync theme
  useEffect(() => {
    const activeTheme = localStorage.getItem("theme") as "dark" | "light" || "dark";
    setTheme(activeTheme);
    if (activeTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  // Define and rebuild milestones list based on selected track
  useEffect(() => {
    let rawMilestones: Milestone[] = [];

    if (selectedTrack === "faang") {
      rawMilestones = [
        {
          id: "arrays-basics",
          title: "1. Linear Scans & Sliding Windows",
          desc: "Optimizing arrays operations, two-pointer complements, and sub-array partitions.",
          difficulty: "Intermediate",
          estimatedHours: 6,
          color: "from-cyan-400 to-indigo-400",
          subTopics: [
            { id: "two-pointers", label: "Two Pointers Complement Matching", completed: false },
            { id: "sliding-window", label: "Sliding Window Maximum Finder", completed: false },
            { id: "subarray-sum", label: "Contiguous Subarray Sum Analysis", completed: false }
          ]
        },
        {
          id: "stacks-queues",
          title: "2. Monotonic Stacks & Deques",
          desc: "Evaluating Reverse Polish notation, monotonic stacks, and Daily Temperature waiting indexes.",
          difficulty: "Intermediate",
          estimatedHours: 8,
          color: "from-cyan-400 to-indigo-400",
          subTopics: [
            { id: "valid-bracket", label: "Valid Parentheses checks", completed: false },
            { id: "min-stack", label: "Min Stack construction in O(1)", completed: false },
            { id: "temp-stack", label: "Next Greater Element using Monotonic Stack", completed: false }
          ]
        },
        {
          id: "hash-tables",
          title: "3. Fast Lookups & Collision Buckets",
          desc: "Two Sum mapping searches, duplicate checks, and anagram groupings.",
          difficulty: "Intermediate",
          estimatedHours: 8,
          color: "from-violet-400 to-indigo-400",
          subTopics: [
            { id: "two-sum-map", label: "Two Sum Map complemented lookup", completed: false },
            { id: "anagrams", label: "Group Anagrams via letter key sorting", completed: false },
            { id: "freq-map", label: "Top K Frequent elements", completed: false }
          ]
        },
        {
          id: "linked-lists",
          title: "4. Node Pointers Reversal",
          desc: "Swapping list items, reversing nodes, finding loop cycles, and removing Nth end items.",
          difficulty: "Intermediate",
          estimatedHours: 10,
          color: "from-purple-400 to-rose-400",
          subTopics: [
            { id: "rev-list", label: "Singly Linked List node reversal", completed: false },
            { id: "loop-check", label: "Detect Loop cycles using Fast/Slow pointers", completed: false },
            { id: "merge-lists", label: "Merge Two Sorted lists", completed: false }
          ]
        },
        {
          id: "trees-bst",
          title: "5. Binary Tree Traversals & Depth",
          desc: "Breadth-First searches, recursive tree max depth calculations, Invert Tree node swaps, and Inorder sequences.",
          difficulty: "Advanced",
          estimatedHours: 12,
          color: "from-rose-400 to-amber-400",
          subTopics: [
            { id: "depth-tree", label: "Maximum Depth of Binary Tree", completed: false },
            { id: "invert-tree", label: "Invert Binary Tree (Mirror subtree swaps)", completed: false },
            { id: "level-order", label: "Level Order Traversal using FIFO Queue", completed: false }
          ]
        }
      ];
    } else if (selectedTrack === "foundation") {
      rawMilestones = [
        {
          id: "arrays-basics",
          title: "1. Array Storage & Traversals",
          desc: "Linear memory layout, elements indexing, inserting, and deleting.",
          difficulty: "Beginner",
          estimatedHours: 4,
          color: "from-cyan-400 to-emerald-400",
          subTopics: [
            { id: "indexing", label: "Array indices and memory lookups", completed: false },
            { id: "reverse-array", label: "Reverse an array in-place", completed: false }
          ]
        },
        {
          id: "stacks-queues",
          title: "2. Linear Stack & Queue Sandbox",
          desc: "First In First Out (FIFO) vs Last In First Out (LIFO) visualizer operations.",
          difficulty: "Beginner",
          estimatedHours: 6,
          color: "from-cyan-400 to-emerald-400",
          subTopics: [
            { id: "stack-push", label: "Perform push & pop operations", completed: false },
            { id: "queue-enqueue", label: "Perform enqueue & dequeue operations", completed: false }
          ]
        },
        {
          id: "linked-lists",
          title: "3. Singly Linked List Basics",
          desc: "Singly linked nodes, head references, traversal pointers, and tail insertion.",
          difficulty: "Beginner",
          estimatedHours: 8,
          color: "from-purple-400 to-rose-400",
          subTopics: [
            { id: "list-traverse", label: "Traverse a singly linked sequence", completed: false },
            { id: "list-insert", label: "Insert node atHead vs atTail", completed: false }
          ]
        }
      ];
    } else {
      // Competitive programming
      rawMilestones = [
        {
          id: "trees-bst",
          title: "1. AVL Trees & Self-Balancing",
          desc: "Understanding heights balance factor, left/right rotations, and self-balancing BST nodes.",
          difficulty: "Advanced",
          estimatedHours: 10,
          color: "from-rose-400 to-amber-400",
          subTopics: [
            { id: "balance-factor", label: "Calculate balance factors (left - right height)", completed: false },
            { id: "avl-rotations", label: "Perform single & double balancing rotations", completed: false }
          ]
        },
        {
          id: "sorting-recursion",
          title: "2. Binary Heaps & Heapify",
          desc: "Constructing Min/Max Heaps, bubbling up elements, and heapifying arrays indices relations.",
          difficulty: "Advanced",
          estimatedHours: 12,
          color: "from-amber-400 to-emerald-400",
          subTopics: [
            { id: "bubble-up", label: "Bubble up insertion swaps", completed: false },
            { id: "heapify-arrays", label: "Heapify array indexes in-place", completed: false }
          ]
        },
        {
          id: "graph-traversal",
          title: "3. Interactive Graph Dijkstra Paths",
          desc: "Directed graph canvas operations, vertex coordinates, edge connection weights, and pathfinding.",
          difficulty: "Advanced",
          estimatedHours: 15,
          color: "from-rose-400 to-indigo-500",
          subTopics: [
            { id: "bfs-dfs", label: "Graph BFS vs DFS vertex scans", completed: false },
            { id: "dijkstra-weights", label: "Dijkstra shortest path algorithm", completed: false }
          ]
        }
      ];
    }

    // Load saved checklist progress from localStorage
    const saved = localStorage.getItem(`roadmap-progress-${selectedTrack}`);
    if (saved) {
      try {
        const completedIds: string[] = JSON.parse(saved);
        rawMilestones.forEach(m => {
          m.subTopics.forEach(t => {
            if (completedIds.includes(t.id)) t.completed = true;
          });
        });
      } catch (e) {}
    }

    setMilestones(rawMilestones);
    setActiveMilestoneId(rawMilestones[0]?.id || "arrays-basics");
  }, [selectedTrack]);

  // Topic click checkbox handler
  const handleToggleTopic = (milestoneId: string, topicId: string) => {
    const updated = milestones.map(m => {
      if (m.id === milestoneId) {
        const updatedTopics = m.subTopics.map(t => {
          if (t.id === topicId) return { ...t, completed: !t.completed };
          return t;
        });
        return { ...m, subTopics: updatedTopics };
      }
      return m;
    });
    setMilestones(updated);

    // Save state back to local storage
    const completedIds: string[] = [];
    updated.forEach(m => {
      m.subTopics.forEach(t => {
        if (t.completed) completedIds.push(t.id);
      });
    });
    localStorage.setItem(`roadmap-progress-${selectedTrack}`, JSON.stringify(completedIds));
  };

  // Calculate metrics
  const totalChecks = milestones.reduce((sum, m) => sum + m.subTopics.length, 0);
  const completedChecks = milestones.reduce((sum, m) => sum + m.subTopics.filter(t => t.completed).length, 0);
  const overallPercentage = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  const activeMilestone = milestones.find(m => m.id === activeMilestoneId) || milestones[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      
      {/* Navbar Header */}
      <nav className="border-b border-border bg-slate-900/5 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            AlgoVision Smart Plan
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 border border-border rounded-xl bg-card hover:bg-slate-800/10 transition cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
          <span className="text-xs bg-primary/10 border border-primary/30 text-primary px-3 py-1 rounded-full font-bold">
            Interactive tracker
          </span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* LEFT: Path Tracks & Milestones checklist */}
        <section className="space-y-6">
          <header className="rounded-3xl border border-border bg-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-soft">
            <div className="flex items-center gap-4">
              <Compass className="h-10 w-10 text-primary shrink-0" />
              <div>
                <h1 className="text-xl font-black">Choose Study Track Goal</h1>
                <p className="text-xs text-muted mt-0.5 font-sans">Toggle prep modes to dynamically refresh curriculum milestones list.</p>
              </div>
            </div>
            
            {/* Tracks */}
            <div className="flex gap-2 bg-background p-1.5 rounded-2xl border border-border self-start md:self-auto">
              <button
                onClick={() => setSelectedTrack("faang")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${selectedTrack === "faang" ? "bg-primary text-slate-950" : "text-muted"}`}
              >
                FAANG Prep
              </button>
              <button
                onClick={() => setSelectedTrack("foundation")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${selectedTrack === "foundation" ? "bg-primary text-slate-950" : "text-muted"}`}
              >
                Foundation
              </button>
              <button
                onClick={() => setSelectedTrack("competitive")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${selectedTrack === "competitive" ? "bg-primary text-slate-950" : "text-muted"}`}
              >
                CP Advanced
              </button>
            </div>
          </header>

          {/* Roadmilestone List Nodes */}
          <div className="space-y-4 relative">
            <div className="absolute left-[26px] top-6 bottom-6 w-0.5 bg-border hidden sm:block"></div>

            {milestones.map((m, idx) => {
              const isActive = activeMilestoneId === m.id;
              const solvedCount = m.subTopics.filter(t => t.completed).length;
              const isFinished = solvedCount === m.subTopics.length;

              return (
                <div
                  key={m.id}
                  onClick={() => setActiveMilestoneId(m.id)}
                  className={`flex flex-col sm:flex-row gap-4 p-5 rounded-3xl border cursor-pointer transition duration-300 relative ${
                    isActive
                      ? "bg-card border-primary/40 shadow-soft"
                      : "bg-card/40 border-border/40 hover:border-border"
                  }`}
                >
                  <div className="flex sm:justify-center items-center shrink-0 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-bold text-xs ${
                      isFinished
                        ? "bg-emerald-500/10 border-emerald-400 text-emerald-500"
                        : isActive
                        ? "bg-primary/20 border-primary text-primary"
                        : "bg-background border-border text-muted"
                    }`}>
                      {isFinished ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-sm text-foreground">{m.title}</h3>
                        <p className="text-xs text-muted mt-1 font-sans">{m.desc}</p>
                      </div>
                      <span className="text-[8px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-border text-muted">
                        {m.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-muted pt-1">
                      <span>🕒 {m.estimatedHours} Hours</span>
                      <span>•</span>
                      <span className="text-primary font-bold">{solvedCount} / {m.subTopics.length} Done</span>
                    </div>

                    <div className="w-full bg-background h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${(solvedCount / m.subTopics.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RIGHT: Selected Milestone focus & Checkboxes checklist */}
        <section className="space-y-6">
          
          {activeMilestone && (
            <div className="rounded-3xl border border-border bg-card p-6 space-y-6 shadow-soft">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-base font-bold">Concept Checklist Progress</h2>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <p className="text-muted mb-2">Check off these sub-concepts as you finish practice questions or visual sandboxes:</p>
                
                {activeMilestone.subTopics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => handleToggleTopic(activeMilestone.id, topic.id)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background/50 hover:bg-background transition cursor-pointer select-none"
                  >
                    {topic.completed ? (
                      <CheckSquare className="h-4.5 w-4.5 text-primary shrink-0" />
                    ) : (
                      <Square className="h-4.5 w-4.5 text-muted shrink-0" />
                    )}
                    <span className={`text-xs ${topic.completed ? "line-through text-muted" : "text-foreground"}`}>
                      {topic.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <Link
                  href="/practice"
                  className="w-full h-11 bg-primary text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition text-xs cursor-pointer"
                >
                  <Code2 className="h-4 w-4" /> Start Practice Coding
                </Link>
                <Link
                  href="/visualizer"
                  className="w-full h-11 border border-primary/45 bg-primary/5 text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition text-xs cursor-pointer"
                >
                  <Play className="h-4 w-4" /> Start Manual Visualizer
                </Link>
              </div>
            </div>
          )}

          {/* Global statistics badge */}
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between items-center text-center py-8 shadow-soft">
            <Brain className="h-10 w-10 text-primary mb-3" />
            <h3 className="font-bold text-sm">Overall Completion</h3>
            <span className="text-3xl font-black text-primary mt-1">{overallPercentage}%</span>
            <p className="text-xs text-muted mt-2 max-w-xs font-sans">
              Total checkboxes completed: {completedChecks} / {totalChecks} across the {selectedTrack} track. Progress is stored in local cookies.
            </p>
          </div>

        </section>

      </main>
    </div>
  );
}
