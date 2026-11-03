"use client";

import React, { useState } from "react";
import { Sparkles, Send, Bot, User, BookOpen, Layers, CheckCircle2, Copy, Check, RefreshCw } from "lucide-react";

interface GenAIDocsTutorProps {
  currentContext?: string; // e.g. "stack", "tree", "hash"
}

export default function GenAIDocsTutor({ currentContext = "stack" }: GenAIDocsTutorProps) {
  const [prompt, setPrompt] = useState("");
  const [persona, setPersona] = useState<"educator" | "techwriter" | "architect">("techwriter");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [conversation, setConversation] = useState<Array<{
    role: "user" | "assistant";
    content: string;
    personaTag?: string;
  }>>([
    {
      role: "assistant",
      content: `👋 **Hello! I am your GenAI Technical Documentation Assistant.**\n\nI can explain algorithms in plain English analogies, generate Diátaxis-compliant technical documentation, or analyze hardware cache implications. Try asking me a question or pick one of the quick prompts below!`,
      personaTag: "System Copilot"
    }
  ]);

  const quickPrompts = [
    `How does AVL self-balancing prevent worst-case O(N) degradation?`,
    `Explain Hash Table collisions using the gym locker analogy`,
    `Generate a Diátaxis Task topic for Breadth-First Search (BFS)`,
    `What are the CPU cache locality trade-offs between Array Stack vs Linked Stack?`
  ];

  const handleSend = (text?: string) => {
    const q = text || prompt;
    if (!q.trim() || loading) return;

    const userMsg = { role: "user" as const, content: q };
    setConversation(prev => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    // Simulate sophisticated GenAI response based on query and persona
    setTimeout(() => {
      const aiResponse = synthesizeAIResponse(q, persona);
      setConversation(prev => [...prev, {
        role: "assistant",
        content: aiResponse,
        personaTag: persona === "educator" ? "Plain English Educator" : persona === "techwriter" ? "Diátaxis Technical Writer" : "Systems Architect"
      }]);
      setLoading(false);
    }, 600);
  };

  const synthesizeAIResponse = (query: string, mode: "educator" | "techwriter" | "architect"): string => {
    const lower = query.toLowerCase();

    if (mode === "educator") {
      if (lower.includes("avl") || lower.includes("tree")) {
        return `### 🌳 The Hanging Mobile Analogy for AVL Trees\n\nImagine a decorative hanging baby mobile. If you hang too many toys on the left branch, the whole mobile tilts sideways and gets tangled (an unbalanced tree where searching takes forever, like looking through a straight line).\n\n**What an AVL Tree does:**\nAs soon as it senses that the left side is heavier by more than one weight level, it reaches up and performs a physical rotation. It slides the middle toy to the top so both sides hang in perfect equilibrium! That way, finding any toy never takes more than a few quick hops.`;
      }
      if (lower.includes("hash") || lower.includes("collision")) {
        return `### 🔐 The Gym Locker Analogy for Hash Tables\n\nImagine a busy gym with 100 lockers. When you walk in, the receptionist uses a formula on your name (say, adding the letters together) to give you locker #42.\n\n**The Problem (Collision):**\nSomeone else arrives whose name also calculates to locker #42! What does the gym do?\n1. **Chaining**: They install a rack of secondary cubbies inside locker #42 where both bags sit side by side.\n2. **Open Addressing**: They politely tell the second person: *"Locker 42 is occupied; walk forward and take the very first empty locker you see (#43)"*.\n\nThat is how hash tables store items instantly without checking every locker in the gym!`;
      }
      return `### 💡 Plain English Concept Breakdown\n\nLet's break down **"${query}"** into simple mental models:\n\n1. **The Core Invariant**: Every computing structure is just a physical rule disguised as math. For example, a Queue is simply waiting in a polite line at a coffee shop; a Stack is stacking dinner plates.\n2. **Why Engineers Need It**: If you don't organize the data systematically, finding a single record forces your computer to check millions of items one by one.\n3. **Real-Life Rule of Thumb**: Choose the data structure that matches how your users actually interact with the data!`;
    }

    if (mode === "techwriter") {
      return `---
id: task-algorithmic-procedure
title: How to Implement & Validate ${query.length > 30 ? query.slice(0, 30) + '...' : query}
sidebar_label: Implementation Guide
tags: [algorithms, diataxis, procedure]
---

# Algorithmic Procedure: ${query}

## 1. Conceptual Overview
This topic provides the verified operational procedure and invariant assertions for **${query}** in accordance with topic-based technical authoring standards.

## 2. Prerequisites
- Target runtime environment supporting deterministic memory allocation.
- Unit testing harness with invariant assertions enabled.

## 3. Step-by-Step Procedure
1. **Initialize State Boundaries**: Allocate the primary container buffer and verify that the initial capacity meets workload thresholds.
2. **Evaluate Invariants**: Before executing any mutation (insert/delete), verify that pre-conditions hold:
   - For Tree structures: ensure child pointers satisfy ordering invariants.
   - For Hash tables: verify load factor $\\alpha = n/k \\le 0.75$.
3. **Execute Core Operation**: Perform pointer adjustments or array writes using direct references.
4. **Post-Condition Verification**: Confirm that the collection size reflects the mutation and return status to caller.

## 4. Complexity & Verification Matrix
| Operation | Average Time | Worst-Case Time | Space Overhead |
| :--- | :--- | :--- | :--- |
| **Lookup / Search** | $O(\\log N)$ / $O(1)$ | $O(N)$ | $O(1)$ auxiliary |
| **Mutation (Insert/Delete)** | $O(1)$ amortized | $O(N)$ realloc | $O(N)$ storage |`;
    }

    // mode === "architect"
    return `### 🟣 Systems Architecture & Hardware Analysis\n\n**Query:** \`${query}\`\n\n#### 1. CPU Cache-Line Alignment & Spatial Locality\n- **Contiguous Array Backing**: Cache prefetchers pull 64-byte L1 cache lines into memory. Sequential memory traversals achieve near-100% L1 cache hits with sub-nanosecond access latency.\n- **Pointer-Chasing Penalty**: Node-based allocations (Linked Lists, unrolled trees) distribute nodes across disjoint virtual heap pages. Every pointer dereference ($node \\rightarrow next$) incurs an indirect memory load with potential TLB cache misses (~100 to 200 CPU cycles).\n\n#### 2. Branch Prediction & Instruction Pipelining\n- Balanced search trees (AVL/Red-Black) produce branches with 50/50 probability, resulting in hardware branch mispredictions.\n- B-Trees and flat sorted arrays with Eytzinger layouts maximize branchless SIMD vectorized comparison loops.\n\n#### 3. Amortized Bounds vs. Hard Real-Time Constraints\n- In mission-critical enterprise systems (e.g., storage cluster metadata write logs), $O(1)$ amortized operations with periodic $O(N)$ reallocation spikes violate strict 99.99th percentile SLA latency bounds. Pre-allocated arenas and ring-buffers are strictly required.`;
  };

  const copyResponse = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              GenAI Technical Docs Tutor & Explainer
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                AI Pilot
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive AI model tuned for technical documentation, concept analogies, and systems architecture.
            </p>
          </div>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <span className="text-[11px] font-semibold text-slate-400 px-2">Prompt Mode:</span>
          {[
            { id: "educator", label: "🟢 ELI5 Analogy" },
            { id: "techwriter", label: "🔵 Diátaxis Docs" },
            { id: "architect", label: "🟣 Systems Architect" }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPersona(p.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                persona === p.id 
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-4 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-50 border border-slate-200 text-slate-800"
              }`}
            >
              {msg.personaTag && (
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>{msg.personaTag}</span>
                  <button
                    onClick={() => copyResponse(msg.content)}
                    className="text-slate-400 hover:text-slate-600 transition"
                    title="Copy Markdown"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              )}
              <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                {msg.content}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse pl-10">
            <Sparkles className="h-4 w-4 text-indigo-500" /> GenAI is generating topic explanation in {persona} mode...
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 self-center">Suggested queries:</span>
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition cursor-pointer"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder={`Ask GenAI to explain algorithms, create Diátaxis topics, or describe analogies...`}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !prompt.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" /> Ask AI
        </button>
      </div>
    </div>
  );
}
