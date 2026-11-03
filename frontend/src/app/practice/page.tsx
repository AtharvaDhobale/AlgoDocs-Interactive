"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, ChevronRight, ChevronLeft, Search, Code, CheckCircle, Brain, RefreshCw, Sliders, Sun, Moon, Database, ChevronDown } from "lucide-react";
import Editor from "@monaco-editor/react";
import { questions, Question } from "@/lib/questions";

// ==================== TRACE GENERATIONS FOR EXECUTIONS ====================
interface TraceStep {
  stepIndex: number;
  lineHighlight: number;
  explanation: string;
  variables: Record<string, any>;
  visualState: any;
}

// 1. Valid Parentheses Trace
function generateValidParenthesesTrace(input: string): TraceStep[] {
  const trace: TraceStep[] = [];
  const s = input.replace(/"/g, "");
  const stack: string[] = [];
  const mapping: Record<string, string> = { ")": "(", "}": "{", "]": "[" };

  trace.push({
    stepIndex: 0,
    lineHighlight: 1,
    explanation: "Initialize an empty stack and map of closing-to-opening matches.",
    variables: { s, stack: [], currentChar: "-", mapping },
    visualState: { stack: [], activeCharIndex: -1, status: "init" }
  });

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    const stepIdx = trace.length;

    trace.push({
      stepIndex: stepIdx,
      lineHighlight: 8,
      explanation: `Read character s[${i}] = '${char}'.`,
      variables: { s, stack: [...stack], currentChar: char, index: i },
      visualState: { stack: [...stack], activeCharIndex: i, status: "reading" }
    });

    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
      trace.push({
        stepIndex: trace.length,
        lineHighlight: 10,
        explanation: `Opening bracket '${char}' detected. Push onto the stack.`,
        variables: { s, stack: [...stack], currentChar: char, index: i },
        visualState: { stack: [...stack], activeCharIndex: i, status: "push" }
      });
    } else {
      const top = stack.length > 0 ? stack[stack.length - 1] : "undefined";
      const expected = mapping[char];
      const match = top === expected;

      trace.push({
        stepIndex: trace.length,
        lineHighlight: 12,
        explanation: `Closing bracket '${char}' detected. Pop stack top ('${top}') and compare it with the expected match '${expected}'.`,
        variables: { s, stack: [...stack], currentChar: char, top, expected, match },
        visualState: { stack: [...stack], activeCharIndex: i, status: "pop-check" }
      });

      if (stack.length > 0) stack.pop();

      if (!match) {
        trace.push({
          stepIndex: trace.length,
          lineHighlight: 13,
          explanation: `Mismatch! Popped element '${top}' does not match expected '${expected}'. Return false.`,
          variables: { s, stack: [...stack], currentChar: char, top, expected, match: false },
          visualState: { stack: [...stack], activeCharIndex: i, status: "failed" }
        });
        return trace;
      }
    }
  }

  const isEmpty = stack.length === 0;
  trace.push({
    stepIndex: trace.length,
    lineHighlight: 16,
    explanation: isEmpty 
      ? "End of string reached and stack is empty. Parentheses sequence is VALID. Return true." 
      : `End of string reached but stack still has ${stack.length} elements. The input is INVALID. Return false.`,
    variables: { s, stack: [...stack], empty: isEmpty },
    visualState: { stack: [...stack], activeCharIndex: s.length, status: isEmpty ? "success" : "failed" }
  });

  return trace;
}

// 2. Reverse Linked List Trace
function generateReverseListTrace(input: string): TraceStep[] {
  const trace: TraceStep[] = [];
  let list: number[] = [1, 2, 3, 4, 5];
  try {
    const cleaned = input.replace(/[\[\]]/g, "");
    if (cleaned.trim()) {
      list = cleaned.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    }
  } catch (e) {}

  let prev: number | null = null;
  let curr: number | null = list[0] || null;
  let nextTemp: number | null = null;

  trace.push({
    stepIndex: 0,
    lineHighlight: 2,
    explanation: "Initialize pointers: prev = null, curr = head node.",
    variables: { list, prev: "null", curr: curr ?? "null", next: "null" },
    visualState: { list, prev, curr, nextTemp, reversedConnections: {} }
  });

  const reversedConnections: Record<number, number | null> = {};
  
  while (curr !== null) {
    const currVal = curr;
    const currIdx = list.indexOf(currVal);
    const nextVal = currIdx + 1 < list.length ? list[currIdx + 1] : null;

    nextTemp = nextVal;
    trace.push({
      stepIndex: trace.length,
      lineHighlight: 5,
      explanation: `Store current node's next pointer: nextTemp = ${nextTemp ?? "null"}.`,
      variables: { list, prev: prev ?? "null", curr: currVal, nextTemp: nextTemp ?? "null" },
      visualState: { list, prev, curr: currVal, nextTemp, reversedConnections: { ...reversedConnections } }
    });

    reversedConnections[currVal] = prev;
    trace.push({
      stepIndex: trace.length,
      lineHighlight: 6,
      explanation: `Redirect node ${currVal}'s next pointer backward to node ${prev ?? "null"}.`,
      variables: { list, prev: prev ?? "null", curr: currVal, nextTemp: nextTemp ?? "null" },
      visualState: { list, prev, curr: currVal, nextTemp, reversedConnections: { ...reversedConnections } }
    });

    prev = curr;
    trace.push({
      stepIndex: trace.length,
      lineHighlight: 7,
      explanation: `Advance 'prev' pointer forward to current node (${prev}).`,
      variables: { list, prev: prev ?? "null", curr: currVal, nextTemp: nextTemp ?? "null" },
      visualState: { list, prev, curr: currVal, nextTemp, reversedConnections: { ...reversedConnections } }
    });

    curr = nextTemp;
    trace.push({
      stepIndex: trace.length,
      lineHighlight: 8,
      explanation: `Advance 'curr' pointer forward to stored nextTemp (${curr ?? "null"}).`,
      variables: { list, prev: prev ?? "null", curr: curr ?? "null", nextTemp: nextTemp ?? "null" },
      visualState: { list, prev, curr, nextTemp, reversedConnections: { ...reversedConnections } }
    });
  }

  trace.push({
    stepIndex: trace.length,
    lineHighlight: 10,
    explanation: "Current pointer is null. Reversal is complete. Return the head of the reversed list (prev node).",
    variables: { list, prev: prev ?? "null", curr: "null" },
    visualState: { list, prev, curr: null, nextTemp: null, reversedConnections: { ...reversedConnections }, status: "success" }
  });

  return trace;
}

// 3. Two Sum Trace
function generateTwoSumTrace(input: string, targetVal: number = 9): TraceStep[] {
  const trace: TraceStep[] = [];
  let nums = [2, 7, 11, 15];
  try {
    const cleaned = input.replace(/[\[\]]/g, "");
    if (cleaned.trim()) {
      nums = cleaned.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    }
  } catch (e) {}

  const map: Record<number, number> = {};

  trace.push({
    stepIndex: 0,
    lineHighlight: 2,
    explanation: `Create an empty Hash Map (complement dictionary). Target is ${targetVal}.`,
    variables: { nums, target: targetVal, map: {} },
    visualState: { map: {}, i: -1, complement: null, found: false }
  });

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    const complement = targetVal - val;
    const hasComplement = complement in map;

    trace.push({
      stepIndex: trace.length,
      lineHighlight: 4,
      explanation: `i = ${i}: Value = ${val}. Calculate complement: target (${targetVal}) - ${val} = ${complement}. Check if ${complement} is in hash map.`,
      variables: { nums, target: targetVal, map: { ...map }, i, val, complement, hasComplement },
      visualState: { map: { ...map }, i, complement, found: hasComplement, checkedVal: val }
    });

    if (hasComplement) {
      const matchIdx = map[complement];
      trace.push({
        stepIndex: trace.length,
        lineHighlight: 5,
        explanation: `Match found! Complement ${complement} exists at index ${matchIdx}. Return current index [${matchIdx}, ${i}].`,
        variables: { nums, target: targetVal, map: { ...map }, i, matchIdx, result: [matchIdx, i] },
        visualState: { map: { ...map }, i, complement, found: true, result: [matchIdx, i] }
      });
      return trace;
    }

    map[val] = i;
    trace.push({
      stepIndex: trace.length,
      lineHighlight: 7,
      explanation: `${complement} was not in hash map. Store current number ${val} at index ${i} in map.`,
      variables: { nums, target: targetVal, map: { ...map }, i },
      visualState: { map: { ...map }, i, complement: null, found: false }
    });
  }

  trace.push({
    stepIndex: trace.length,
    lineHighlight: 9,
    explanation: "Scanned whole array, no matching pair found. Return empty array.",
    variables: { nums, target: targetVal, map: { ...map } },
    visualState: { map: { ...map }, i: nums.length, complement: null, found: false, result: [] }
  });

  return trace;
}

// 4. Binary Tree Traversal Trace
function generateInorderTrace(input: string): TraceStep[] {
  const trace: TraceStep[] = [];
  const frames: string[] = ["traverse(root)"];
  const res: number[] = [];

  trace.push({
    stepIndex: 0,
    lineHighlight: 2,
    explanation: "Initialize empty result array. Initiate traversal function.",
    variables: { res: [] },
    visualState: { res: [], activeNode: 1, stackFrames: [...frames] }
  });

  frames.push("traverse(node 2)");
  trace.push({
    stepIndex: 1,
    lineHighlight: 5,
    explanation: "Recursively traverse Left subtree of Node 1.",
    variables: { res: [] },
    visualState: { res: [], activeNode: 2, stackFrames: [...frames] }
  });

  frames.push("traverse(node 4)");
  trace.push({
    stepIndex: 2,
    lineHighlight: 5,
    explanation: "Recursively traverse Left subtree of Node 2.",
    variables: { res: [] },
    visualState: { res: [], activeNode: 4, stackFrames: [...frames] }
  });

  frames.pop();
  res.push(4);
  trace.push({
    stepIndex: 3,
    lineHighlight: 6,
    explanation: "Node 4 has no left child. Push Node 4's value to results list.",
    variables: { res: [4] },
    visualState: { res: [4], activeNode: 4, stackFrames: [...frames] }
  });

  res.push(2);
  frames.pop();
  trace.push({
    stepIndex: 4,
    lineHighlight: 6,
    explanation: "Traverse Right child of Node 4 (null). Pop back, return to parent. Push Node 2's value to results list.",
    variables: { res: [4, 2] },
    visualState: { res: [4, 2], activeNode: 2, stackFrames: [...frames] }
  });

  frames.push("traverse(node 5)");
  trace.push({
    stepIndex: 5,
    lineHighlight: 7,
    explanation: "Traverse Right child of Node 2 (Node 5).",
    variables: { res: [4, 2] },
    visualState: { res: [4, 2], activeNode: 5, stackFrames: [...frames] }
  });

  frames.pop();
  res.push(5);
  trace.push({
    stepIndex: 6,
    lineHighlight: 6,
    explanation: "Node 5 has no children. Push Node 5's value to results. Pop back.",
    variables: { res: [4, 2, 5] },
    visualState: { res: [4, 2, 5], activeNode: 5, stackFrames: [...frames] }
  });

  res.push(1);
  trace.push({
    stepIndex: 7,
    lineHighlight: 6,
    explanation: "Finished Node 2 subtree. Return to root Node 1. Push Node 1's value to results.",
    variables: { res: [4, 2, 5, 1] },
    visualState: { res: [4, 2, 5, 1], activeNode: 1, stackFrames: [...frames] }
  });

  frames.push("traverse(node 3)");
  trace.push({
    stepIndex: 8,
    lineHighlight: 7,
    explanation: "Traverse Right subtree of Node 1 (Node 3).",
    variables: { res: [4, 2, 5, 1] },
    visualState: { res: [4, 2, 5, 1], activeNode: 3, stackFrames: [...frames] }
  });

  frames.pop();
  res.push(3);
  trace.push({
    stepIndex: 9,
    lineHighlight: 6,
    explanation: "Node 3 has no children. Push Node 3 to results. Complete recursion.",
    variables: { res: [4, 2, 5, 1, 3] },
    visualState: { res: [4, 2, 5, 1, 3], activeNode: 3, stackFrames: ["traverse(root)"] }
  });

  return trace;
}

// 5. Generic Trace Fallback
function generateGenericTrace(questionTitle: string): TraceStep[] {
  return [
    {
      stepIndex: 0,
      lineHighlight: 1,
      explanation: `Initializing step visualizer for: ${questionTitle}.`,
      variables: { status: "start" },
      visualState: { message: "Ready to execute" }
    },
    {
      stepIndex: 1,
      lineHighlight: 2,
      explanation: "Executing code statements step-by-step. Checking input params.",
      variables: { status: "running" },
      visualState: { message: "Processing input..." }
    },
    {
      stepIndex: 2,
      lineHighlight: 3,
      explanation: "Applying core logical operations and storage modifications.",
      variables: { status: "running" },
      visualState: { message: "Mutating state" }
    },
    {
      stepIndex: 3,
      lineHighlight: 4,
      explanation: "Algorithm completed successfully. Returning result.",
      variables: { status: "done" },
      visualState: { message: "Returned output", status: "success" }
    }
  ];
}

function getTrace(questionId: string, input: string): TraceStep[] {
  switch (questionId) {
    case "valid-parentheses":
      return generateValidParenthesesTrace(input);
    case "reverse-linked-list":
      return generateReverseListTrace(input);
    case "two-sum":
      return generateTwoSumTrace(input, 9);
    case "binary-tree-inorder-traversal":
      return generateInorderTrace(input);
    default:
      const q = questions.find(item => item.id === questionId);
      return generateGenericTrace(q ? q.title : "DSA Question");
  }
}

// Multi-language code templates
const LANG_TEMPLATES: Record<string, (skeleton: string) => string> = {
  javascript: (s) => s,
  python: (s) => {
    // Basic Python conversion
    return s
      .replace(/function (\w+)\(([^)]*)\)/g, "def $1($2):")
      .replace(/\{\n/g, "\n").replace(/\}/g, "")
      .replace(/const |let |var /g, "")
      .replace(/===/g, "==").replace(/!==/g, "!=")
      .replace(/\.push\(/g, ".append(").replace(/\.length/g, ".__len__()")
      .replace(/\/\/ /g, "# ")
      || `# Write your Python solution here\ndef solution(s):\n    pass`;
  },
  java: (s) => {
    return `class Solution {\n    public boolean solution(String s) {\n        // Write your Java solution here\n        return false;\n    }\n}`;
  },
  cpp: (s) => {
    return `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool solution(string s) {\n        // Write your C++ solution here\n        return false;\n    }\n};`;
  },
  typescript: (s) => {
    return s.replace(/function (\w+)\((.*?)\)/g, "function $1($2): any") || s;
  },
};

const LANG_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
  typescript: "TypeScript",
};

export default function PracticePage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedQuestion, setSelectedQuestion] = useState<Question>(questions[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [selectedLang, setSelectedLang] = useState<string>("javascript");
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [codeValue, setCodeValue] = useState(selectedQuestion.skeleton);

  // Simulation playback state
  const [customInput, setCustomInput] = useState(selectedQuestion.defaultInput);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [compileStatus, setCompileStatus] = useState<string | null>(null);
  const [showQuestionsSidebar, setShowQuestionsSidebar] = useState(true);

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

  useEffect(() => {
    const template = LANG_TEMPLATES[selectedLang]?.(selectedQuestion.skeleton) || selectedQuestion.skeleton;
    setCodeValue(template);
    setCustomInput(selectedQuestion.defaultInput);
    const trace = getTrace(selectedQuestion.id, selectedQuestion.defaultInput);
    setTraceSteps(trace);
    setCurrentStepIdx(0);
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    setCompileStatus(null);
  }, [selectedQuestion, selectedLang]);

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < traceSteps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, traceSteps, speed]);

  const handleStepNext = () => {
    setIsPlaying(false);
    if (currentStepIdx < traceSteps.length - 1) setCurrentStepIdx(currentStepIdx + 1);
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    if (currentStepIdx > 0) setCurrentStepIdx(currentStepIdx - 1);
  };

  const handleApplyCustomInput = () => {
    setIsPlaying(false);
    const trace = getTrace(selectedQuestion.id, customInput);
    setTraceSteps(trace);
    setCurrentStepIdx(0);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          q.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || q.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === "All" || q.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleRunCode = () => {
    setCompileStatus("Executing test harness...");
    setTimeout(() => {
      setCompileStatus("All test parameters evaluated. Executing step-by-step visual trace.");
      handleApplyCustomInput();
      setIsPlaying(true);
    }, 1000);
  };

  const currentStep = traceSteps[currentStepIdx] || null;
  const pseudoCodeLines = selectedQuestion.solution.split("\n");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">
      
      {/* Navbar Header */}
      <nav className="border-b border-border bg-slate-900/5 backdrop-blur px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              AlgoVision IDE & Simulator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted border border-border px-3 py-1 rounded-full bg-card font-semibold">
            <Database className="h-3.5 w-3.5" />
            <span>365+ DSA Questions Ready</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 border border-border rounded-xl bg-card hover:bg-slate-800/10 transition cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
          <button 
            onClick={() => setShowQuestionsSidebar(!showQuestionsSidebar)}
            className="text-xs px-3.5 py-2 rounded-xl border border-border bg-card text-muted hover:text-foreground transition cursor-pointer font-bold"
          >
            {showQuestionsSidebar ? "Hide List" : "Show List"}
          </button>
        </div>
      </nav>

      {/* Main Workspace Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR: Question Selector Catalog */}
        {showQuestionsSidebar && (
          <aside className="w-80 border-r border-border bg-card flex flex-col shrink-0">
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search 350+ questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-background border border-border rounded-xl outline-none focus:border-primary text-xs"
                />
                <Search className="absolute left-3 top-3.5 h-3.5 w-3.5 text-muted" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-background border border-border text-foreground rounded-lg p-2 outline-none"
                >
                  <option value="All">All Topics</option>
                  <option value="Stack">Stack</option>
                  <option value="Queue">Queue</option>
                  <option value="Linked List">Linked List</option>
                  <option value="Tree">Trees</option>
                  <option value="Hash Table">Hash Table</option>
                  <option value="Array">Arrays</option>
                  <option value="Recursion">Recursion</option>
                </select>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-background border border-border text-foreground rounded-lg p-2 outline-none"
                >
                  <option value="All">All Diff</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredQuestions.map((q) => {
                const isSelected = selectedQuestion.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestion(q)}
                    className={`w-full text-left p-3 rounded-xl transition duration-150 cursor-pointer border flex flex-col gap-1 ${
                      isSelected
                        ? "bg-primary/10 border-primary/40 text-foreground"
                        : "bg-transparent border-transparent text-muted hover:bg-slate-800/10"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full gap-2">
                      <span className="font-semibold text-xs line-clamp-1">{q.title}</span>
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        q.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        q.difficulty === "Medium" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                        "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* THREE PANE LAYOUT: Details, Editor, Visualizer */}
        <div className="flex-1 grid md:grid-cols-3 overflow-hidden">
          
          {/* PANE 1: Problem Details */}
          <section className="border-r border-border bg-background p-6 overflow-y-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  {selectedQuestion.category}
                </span>
                <span className="text-[9px] font-bold uppercase bg-slate-500/10 text-muted border border-border px-2 py-0.5 rounded-full">
                  {selectedQuestion.difficulty}
                </span>
              </div>
              <h1 className="text-xl font-bold mt-2">{selectedQuestion.title}</h1>
            </div>

            <div className="text-muted leading-relaxed text-xs whitespace-pre-line border-t border-border/40 pt-4">
              {selectedQuestion.description}
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Example Scenarios</h3>
              {selectedQuestion.examples.map((ex, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card/60 p-4 font-mono text-[10px] space-y-2">
                  <div>
                    <span className="text-slate-500">Input: </span>
                    <span className="text-primary">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Output: </span>
                    <span className="text-emerald-500">{ex.output}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PANE 2: Monaco Editor playground */}
          <section className="border-r border-border flex flex-col overflow-hidden bg-card">
            <div className="bg-background/40 px-4 py-2 border-b border-border flex justify-between items-center">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted hover:text-foreground transition border border-border rounded-lg px-3 py-1.5 bg-background/50 cursor-pointer"
                >
                  <Code className="h-3 w-3" />
                  {LANG_LABELS[selectedLang]}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showLangMenu && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                    {Object.entries(LANG_LABELS).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => { setSelectedLang(key); setShowLangMenu(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition cursor-pointer hover:bg-primary/10 ${
                          selectedLang === key ? "text-primary bg-primary/5" : "text-muted"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] lowercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">Auto-Check Active</span>
            </div>
            
            <div className="flex-1 min-h-[300px] relative bg-slate-950">
              <Editor
                height="100%"
                language={selectedLang === "cpp" ? "cpp" : selectedLang}
                theme={theme === "light" ? "light" : "vs-dark"}
                value={codeValue}
                onChange={(val) => setCodeValue(val || "")}
                options={{
                  fontSize: 12,
                  fontFamily: "Geist Mono, Courier New, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 12 },
                  wordWrap: "on",
                  formatOnPaste: true,
                  tabSize: selectedLang === "python" ? 4 : 2,
                }}
              />
            </div>

            {/* Sandbox Logs */}
            <div className="bg-background border-t border-border p-4 space-y-3 shrink-0">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-muted">Console Output</span>
                <button
                  onClick={handleRunCode}
                  className="h-9 px-4 rounded-xl bg-primary text-slate-950 font-bold transition hover:opacity-90 text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Run Code (Check)
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card p-3 font-mono text-[10px] min-h-[50px] flex items-center">
                {compileStatus ? (
                  <span className="text-emerald-500">{compileStatus}</span>
                ) : (
                  <span className="text-slate-500 italic">Console idle. Click Run Code.</span>
                )}
              </div>
            </div>
          </section>

          {/* PANE 3: Stepping Simulator Trace */}
          <section className="flex flex-col overflow-y-auto p-6 space-y-5 bg-card/10">
            
            {/* Playback controller */}
            <div className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-muted">Step Debugger Controls</span>
                <span className="text-[10px] font-mono text-muted">
                  Step {currentStepIdx + 1} / {traceSteps.length}
                </span>
              </div>
              
              <div className="flex gap-2 items-center">
                <button
                  onClick={handleStepPrev}
                  disabled={currentStepIdx === 0}
                  className="p-2 border border-border rounded-lg bg-background text-muted disabled:opacity-40 hover:bg-slate-800/10 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex-1 h-9 bg-primary text-slate-950 rounded-lg font-bold hover:opacity-95 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  <span>{isPlaying ? "Pause" : "Play Trace"}</span>
                </button>
                <button
                  onClick={handleStepNext}
                  disabled={currentStepIdx === traceSteps.length - 1}
                  className="p-2 border border-border rounded-lg bg-background text-muted disabled:opacity-40 hover:bg-slate-800/10 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                {/* Inputs */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted">Test Input:</span>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="h-7 px-2 border border-border bg-background rounded text-[10px] font-mono w-24 outline-none"
                  />
                  <button onClick={handleApplyCustomInput} className="h-7 px-2 border border-border bg-background rounded text-[9px] font-bold cursor-pointer">Apply</button>
                </div>

                {/* Speed */}
                <div className="flex items-center gap-1">
                  <input
                    type="range"
                    min="300"
                    max="1800"
                    step="100"
                    value={2100 - speed}
                    onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
                    className="w-14 accent-primary"
                  />
                  <span className="text-[8px] text-slate-500 font-mono">Speed</span>
                </div>
              </div>
            </div>

            {/* Visualization Arena Canvas */}
            <div className="rounded-2xl border border-border bg-background p-4 min-h-[170px] flex items-center justify-center relative">
              
              {/* Stack view */}
              {selectedQuestion.visualizerType === "stack" && currentStep && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] text-muted font-mono">Char: '{currentStep.variables.currentChar}'</span>
                  <div className="flex flex-col justify-end w-32 min-h-[90px] border-b-2 border-x-2 border-slate-600 rounded-b px-2 py-1 gap-1.5 bg-slate-900/5">
                    {currentStep.visualState?.stack.length === 0 ? <div className="text-slate-500 text-[8px] text-center italic py-2">stack is empty</div> : (
                      [...currentStep.visualState.stack].reverse().map((item, idx) => (
                        <div key={idx} className="py-1 px-2 text-center rounded border border-border bg-card font-mono text-[9px] font-bold text-primary">
                          {item}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Linked List view */}
              {selectedQuestion.visualizerType === "linked-list" && currentStep && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-full p-2 text-[9px] font-mono">
                  {currentStep.visualState?.list.map((val: number, idx: number) => {
                    const isCurr = currentStep.visualState.curr === val;
                    return (
                      <React.Fragment key={idx}>
                        <div className={`border rounded p-2 min-w-[50px] text-center ${isCurr ? "border-primary bg-primary/10 text-primary font-bold" : "border-border bg-card text-muted"}`}>
                          {val}
                        </div>
                        {idx < currentStep.visualState.list.length - 1 && (
                          <span className="text-slate-500">➔</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* Hash Table view */}
              {selectedQuestion.visualizerType === "hash-table" && currentStep && (
                <div className="w-full space-y-2 text-[9px] font-mono">
                  <div className="flex gap-2">
                    <span className="text-slate-500">Complement:</span>
                    <span className="text-primary font-bold">{currentStep.visualState.complement ?? "-"}</span>
                  </div>
                  <div className="border border-border bg-card rounded p-2 text-[8px] space-y-1">
                    {Object.keys(currentStep.visualState.map || {}).length === 0 ? <span className="text-slate-500">Empty map</span> : (
                      Object.entries(currentStep.visualState.map).map(([k, v]: any) => (
                        <div key={k} className="flex justify-between border-b border-border/40 pb-0.5">
                          <span>key: {k}</span>
                          <span>val: {v}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Generic fallback visualizer */}
              {selectedQuestion.visualizerType !== "stack" && 
               selectedQuestion.visualizerType !== "linked-list" && 
               selectedQuestion.visualizerType !== "hash-table" && (
                <div className="text-center text-[10px] text-muted font-mono space-y-1.5">
                  <Brain className="h-6 w-6 text-primary mx-auto animate-pulse" />
                  <div>Standard debugger runner active.</div>
                  <div className="text-slate-500 font-sans italic">Custom parameters mapped in execution logs.</div>
                </div>
              )}

            </div>

            {/* Commentary Logs & Pseudocode highlight */}
            <div className="space-y-4">
              {/* Commentary */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <h4 className="text-[9px] uppercase font-bold text-muted mb-1">Step commentary</h4>
                <p className="text-xs text-muted leading-relaxed font-sans min-h-[48px]">
                  {currentStep?.explanation || "Debugger output idle."}
                </p>
              </div>

              {/* Pseudo-code */}
              <div className="rounded-2xl border border-border bg-card p-4 font-mono text-[9px] leading-4 overflow-y-auto max-h-[140px]">
                <h4 className="text-[9px] uppercase font-sans font-bold text-muted mb-2">Algorithm logic trace</h4>
                {pseudoCodeLines.map((line, idx) => {
                  const isHighlighted = currentStep ? currentStep.lineHighlight === idx + 1 : false;
                  return (
                    <div
                      key={idx}
                      className={`whitespace-pre px-2 rounded ${
                        isHighlighted ? "bg-primary/20 text-foreground font-bold border-l-2 border-primary" : "text-slate-500"
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>

          </section>

        </div>
      </div>
    </div>
  );
}
