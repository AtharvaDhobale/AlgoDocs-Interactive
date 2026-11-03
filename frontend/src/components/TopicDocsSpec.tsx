"use client";

import React, { useState } from "react";
import { BookOpen, ShieldAlert, Cpu, Sparkles, CheckCircle2, Table, Layers, ArrowRight } from "lucide-react";

interface TopicDocsProps {
  activeTab: "stack" | "queue" | "list" | "tree" | "hash" | "graph";
}

export default function TopicDocsSpec({ activeTab }: TopicDocsProps) {
  const [readingLevel, setReadingLevel] = useState<"plain" | "engineer" | "architect">("plain");

  const topicData: Record<string, {
    title: string;
    ditaType: string;
    analogy: string;
    plainExplanation: string;
    engineerExplanation: string;
    architectExplanation: string;
    timeComplexity: { access: string; search: string; insert: string; delete: string };
    spaceComplexity: string;
    failureModes: string[];
    procedureSteps: string[];
  }> = {
    stack: {
      title: "Stack Abstract Data Type (LIFO Specification)",
      ditaType: "Task & Reference Archetype",
      analogy: "A spring-loaded cafeteria plate dispenser. You can only place or take plates from the very top.",
      plainExplanation: "Think of a Stack like an undo button or a pile of dinner plates. Whatever you place on top last is the first item that comes off. You cannot reach inside to remove items from the bottom without lifting everything above it first.",
      engineerExplanation: "Stack enforces Last-In, First-Out (LIFO) semantics via two primary O(1) primitives: push(e) and pop(). Internally backed by a dynamic array or singly linked list. Crucial for recursion call-stacks and expression evaluation.",
      architectExplanation: "Array-backed stacks exhibit high spatial cache locality and near-zero pointer overhead. Amortized push is O(1); worst-case array re-allocation incurs O(N) memory copies. Sizing capacity prevents heap fragmentation.",
      timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
      spaceComplexity: "O(n)",
      failureModes: [
        "Stack Overflow: Unbounded recursion or capacity exhaustion consuming thread stack limits.",
        "Stack Underflow: Invoking pop() on an empty collection without invariant checking."
      ],
      procedureSteps: [
        "Validate pre-condition: ensure stack has not reached MAX_CAPACITY before push.",
        "Increment top pointer / array index counter.",
        "Assign incoming element to buffer[top].",
        "Verify post-condition: top element immediately reflects newly pushed entity."
      ]
    },
    queue: {
      title: "Queue & Buffer Protocol (FIFO Specification)",
      ditaType: "Task & Architecture Archetype",
      analogy: "A water slide line or movie theater queue. The first person to arrive is the first person to enter.",
      plainExplanation: "A Queue operates on fundamental fairness: First-Come, First-Served. Items enter at the back and exit from the front. If you join the line first, you get served first.",
      engineerExplanation: "Queue enforces First-In, First-Out (FIFO) semantics. Enqueue appends to the rear; Dequeue evicts from the front. Circular ring-buffers eliminate shifting overhead in array backings.",
      architectExplanation: "Circular ring-buffers leverage modulo arithmetic over power-of-two capacity masks ((head + 1) & mask) to avoid division. Cache false-sharing between producer and consumer pointers requires cache-line padding.",
      timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
      spaceComplexity: "O(n)",
      failureModes: [
        "Buffer Overflow: Ingestion rate outpacing consumer throughput without backpressure.",
        "Head-of-Line Blocking: Slow item at head stalls all subsequent transactions."
      ],
      procedureSteps: [
        "Verify queue non-full state (tail - head < capacity).",
        "Place element at buffer[tail % capacity].",
        "Increment tail pointer atomically.",
        "Notify consumer thread / event loop."
      ]
    },
    list: {
      title: "Linked List Pointer Chain Specification",
      ditaType: "Concept & Memory Reference",
      analogy: "A scavenger hunt. Each treasure chest contains a clue with the exact GPS coordinates of the next chest.",
      plainExplanation: "Unlike a rigid shelf where books must sit side by side, a linked list scatters items anywhere in memory. Each item holds a pointer telling you where to find the next item.",
      engineerExplanation: "Dynamic sequence of nodes where each node encapsulates data and a next pointer (plus prev in doubly-linked). Provides O(1) insertions/deletions once a node pointer is obtained without memory re-allocation.",
      architectExplanation: "Singly linked lists incur 8-byte pointer overhead per node (16-byte for doubly on 64-bit). Causes frequent CPU cache misses due to pointer-chasing across non-contiguous heap memory pages.",
      timeComplexity: { access: "O(n)", search: "O(n)", insert: "O(1)", delete: "O(1)" },
      spaceComplexity: "O(n)",
      failureModes: [
        "Dangling Pointer: Freeing a node without detaching references from predecessor.",
        "Cycle / Infinite Loop: A node pointing back to an ancestor without cycle detection (Floyd's algorithm)."
      ],
      procedureSteps: [
        "Allocate new heap node with target payload.",
        "Point new_node.next to current head pointer.",
        "Update head pointer to reference new_node.",
        "Verify null-termination at tail boundary."
      ]
    },
    tree: {
      title: "Binary Search Tree & AVL Self-Balancing Specification",
      ditaType: "Algorithm & Architecture Spec",
      analogy: "A sorted telephone directory. At each page, you check if the target name is earlier (go left) or later (go right).",
      plainExplanation: "Trees let you find things in seconds by dividing the remaining options in half at every step. Self-balancing trees (AVL) rotate branches automatically so no single branch gets too long.",
      engineerExplanation: "Binary Search Trees (BST) maintain the invariant that left subtree < node < right subtree. AVL trees enforce balance factor BF in {-1, 0, 1} through 4 deterministic rotations: LL, RR, LR, RL.",
      architectExplanation: "Unbalanced BST degrades to O(N) degenerate linked list under sorted inputs. AVL guarantees strict O(log N) depth at the cost of rotation overhead on writes. B-Trees are preferred in disk/block storage for cache page alignment.",
      timeComplexity: { access: "O(log n)", search: "O(log n)", insert: "O(log n)", delete: "O(log n)" },
      spaceComplexity: "O(n)",
      failureModes: [
        "Tree Skewness: Sequential insertions degrading height to N.",
        "Recursive Depth Overflow: Extremely deep trees exceeding thread stack size."
      ],
      procedureSteps: [
        "Compare insert value with root: if smaller go left, if larger go right.",
        "Recurse until empty null slot is discovered.",
        "Insert leaf node and recalculate ancestor heights.",
        "If balance factor > 1 or < -1, execute corresponding rotation (left or right)."
      ]
    },
    hash: {
      title: "Hash Table & Associative Array Specification",
      ditaType: "Systems & Security Reference",
      analogy: "Assigned lockers at a gym. A math formula turns your name into an exact locker number so you find your clothes instantly.",
      plainExplanation: "A hash table is a magic drawer where you can put anything away with a name tag. When you ask for that name tag later, it knows the exact slot instantly without searching one by one.",
      engineerExplanation: "Associative key-value store mapping keys to bucket indices via a deterministic hash function: index = hash(key) % capacity. Collisions are resolved through separate chaining (linked lists) or open addressing (linear probing).",
      architectExplanation: "Hash tables achieve O(1) average lookup. Load factor alpha = n/k must trigger rehashing (typically at 0.75) to prevent collision clustering. Cryptographically weak hash functions are vulnerable to HashDoS algorithmic complexity attacks.",
      timeComplexity: { access: "O(1) avg", search: "O(1) avg", insert: "O(1) avg", delete: "O(1) avg" },
      spaceComplexity: "O(n)",
      failureModes: [
        "Collision Clustering: Linear probing grouping filled slots, degrading search to O(N).",
        "HashDoS Vulnerability: Adversarial keys targeting identical bucket index."
      ],
      procedureSteps: [
        "Compute hash digest for input string key.",
        "Map digest to array index via modulo: bucket = digest % table_size.",
        "Check bucket: if empty, write key-value pair.",
        "If collision: append to bucket linked chain or probe to next open slot."
      ]
    },
    graph: {
      title: "Graph Traversal & Topology Specification",
      ditaType: "Network & Systems Architecture",
      analogy: "A metropolitan subway map. Stations are connected by rail tunnels, and you find the fastest route between them.",
      plainExplanation: "Graphs connect points of data with pathways. Like roads connecting cities or friends connecting on social media, graphs let you map out networks and find the shortest route from A to B.",
      engineerExplanation: "Graph G = (V, E) composed of vertices and edges. Breadth-First Search (BFS) utilizes a Queue for shortest-path unweighted search. Depth-First Search (DFS) utilizes recursion or a Stack for topological sorting and cycle detection.",
      architectExplanation: "Represented via Adjacency Matrix (O(V^2) memory, O(1) edge lookup) or Adjacency List (O(V+E) memory, cache friendly for sparse graphs). In distributed storage (e.g. Cohesity snapshot DAGs), immutable graphs prevent circular dependencies.",
      timeComplexity: { access: "O(V + E)", search: "O(V + E)", insert: "O(1)", delete: "O(E)" },
      spaceComplexity: "O(V + E)",
      failureModes: [
        "Infinite Traversal Cycle: Forgetting to maintain a visited set causing infinite loops.",
        "Disjoint Islands: Graph partitioning preventing route discovery."
      ],
      procedureSteps: [
        "Initialize visited set and exploration frontier (Queue for BFS, Stack for DFS).",
        "Enqueue root / starting vertex and mark visited.",
        "While frontier non-empty: pop vertex and inspect adjacent neighbors.",
        "For each unvisited neighbor: record edge path, mark visited, and enqueue."
      ]
    }
  };

  const doc = topicData[activeTab] || topicData.stack;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header with Diátaxis Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            <BookOpen className="h-3 w-3" /> {doc.ditaType}
          </div>
          <h2 className="mt-2 text-xl font-bold text-slate-900 tracking-tight">{doc.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Topic-based structured documentation adhering to technical writing craft standards.</p>
        </div>

        {/* Reading Level Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setReadingLevel("plain")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${readingLevel === "plain" ? "bg-white text-emerald-700 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            🟢 Plain English
          </button>
          <button
            onClick={() => setReadingLevel("engineer")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${readingLevel === "engineer" ? "bg-white text-indigo-700 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            🔵 Developer Guide
          </button>
          <button
            onClick={() => setReadingLevel("architect")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${readingLevel === "architect" ? "bg-white text-purple-700 shadow-sm border border-slate-200" : "text-slate-600 hover:text-slate-900"}`}
          >
            🟣 Systems Architect
          </button>
        </div>
      </div>

      {/* Dynamic Reading Level Content */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          {readingLevel === "plain" && "Plain-English Analogy & Conceptual Model"}
          {readingLevel === "engineer" && "Developer Reference & API Contract"}
          {readingLevel === "architect" && "Systems Architecture, Memory Alignment & Cache Locality"}
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          {readingLevel === "plain" && doc.plainExplanation}
          {readingLevel === "engineer" && doc.engineerExplanation}
          {readingLevel === "architect" && doc.architectExplanation}
        </p>
      </div>

      {/* Grid: Complexity Matrix & Procedural Steps */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Complexity Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            <Table className="h-3.5 w-3.5 text-indigo-600" /> Complexity Bounds
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2">Operation</th>
                <th className="py-2">Time Bound</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr><td className="py-2 text-slate-500">Index Access</td><td className="font-mono font-medium text-slate-900">{doc.timeComplexity.access}</td></tr>
              <tr><td className="py-2 text-slate-500">Search Lookup</td><td className="font-mono font-medium text-slate-900">{doc.timeComplexity.search}</td></tr>
              <tr><td className="py-2 text-slate-500">Insertion</td><td className="font-mono font-medium text-indigo-600">{doc.timeComplexity.insert}</td></tr>
              <tr><td className="py-2 text-slate-500">Deletion</td><td className="font-mono font-medium text-indigo-600">{doc.timeComplexity.delete}</td></tr>
              <tr><td className="py-2 text-slate-500">Space Overhead</td><td className="font-mono font-medium text-purple-600">{doc.spaceComplexity}</td></tr>
            </tbody>
          </table>
        </div>

        {/* Task-Based Procedure */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Procedural Implementation
          </div>
          <ol className="space-y-2.5 text-xs text-slate-700 list-decimal list-inside">
            {doc.procedureSteps.map((step, i) => (
              <li key={i} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Failure Modes & Safeguards */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" /> Failure Modes & Edge Case Safeguards
        </div>
        <ul className="space-y-2 text-xs text-slate-700">
          {doc.failureModes.map((fm, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>{fm}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
