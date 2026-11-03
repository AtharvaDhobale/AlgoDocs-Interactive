"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Play, RefreshCw, Plus, Minus, Search,
  Layers, ListOrdered, GitBranch, Hash, ArrowRight,
  Sun, Moon, Zap, BookOpen, FlaskConical, Info
} from "lucide-react";
import TopicDocsSpec from "@/components/TopicDocsSpec";

// ==================== AVL & BST IMPLEMENTATIONS ====================
interface AVLNode {
  val: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

function getHeight(node: AVLNode | null): number { return node ? node.height : 0; }
function getBalance(node: AVLNode | null): number { return node ? getHeight(node.left) - getHeight(node.right) : 0; }

function rightRotate(y: AVLNode): AVLNode {
  const x = y.left!; const T2 = x.right;
  x.right = y; y.left = T2;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  return x;
}
function leftRotate(x: AVLNode): AVLNode {
  const y = x.right!; const T2 = y.left;
  y.left = x; x.right = T2;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  return y;
}
function insertAVL(root: AVLNode | null, val: number, log: (s: string) => void): AVLNode {
  if (!root) return { val, height: 1, left: null, right: null };
  if (val < root.val) root.left = insertAVL(root.left, val, log);
  else if (val > root.val) root.right = insertAVL(root.right, val, log);
  else return root;
  root.height = 1 + Math.max(getHeight(root.left), getHeight(root.right));
  const balance = getBalance(root);
  if (balance > 1 && val < root.left!.val) { log(`⚖️ Imbalance at ${root.val} (Left-Left). Performing Right Rotation.`); return rightRotate(root); }
  if (balance < -1 && val > root.right!.val) { log(`⚖️ Imbalance at ${root.val} (Right-Right). Performing Left Rotation.`); return leftRotate(root); }
  if (balance > 1 && val > root.left!.val) { log(`⚖️ Imbalance at ${root.val} (Left-Right). Double Rotation.`); root.left = leftRotate(root.left!); return rightRotate(root); }
  if (balance < -1 && val < root.right!.val) { log(`⚖️ Imbalance at ${root.val} (Right-Left). Double Rotation.`); root.right = rightRotate(root.right!); return leftRotate(root); }
  return root;
}

interface GraphVertex { id: string; x: number; y: number; label?: string; }
interface GraphEdge { from: string; to: string; }

// ==================== BST SEARCH TRACE ====================
function bstInsertTrace(root: AVLNode | null, val: number): string[] {
  const steps: string[] = [];
  let cur = root;
  steps.push(`🎯 Want to insert ${val} into the BST. Start at the Root.`);
  while (cur) {
    if (val === cur.val) { steps.push(`⚠️ Value ${val} already exists at this node. Skipping duplicate.`); break; }
    if (val < cur.val) {
      steps.push(`🔍 ${val} < ${cur.val} → Go LEFT to explore smaller values.`);
      if (!cur.left) { steps.push(`✅ Found empty spot on the LEFT of ${cur.val}. Insert ${val} here!`); break; }
      cur = cur.left;
    } else {
      steps.push(`🔍 ${val} > ${cur.val} → Go RIGHT to explore larger values.`);
      if (!cur.right) { steps.push(`✅ Found empty spot on the RIGHT of ${cur.val}. Insert ${val} here!`); break; }
      cur = cur.right;
    }
  }
  if (!root) steps.push(`✅ Tree is empty. ${val} becomes the Root node.`);
  return steps;
}

// Compute hash with explanation
function computeHash(key: string, size: number): { index: number; explanation: string } {
  let sum = 0;
  const chars = key.split("").map(c => `${c}(${c.charCodeAt(0)})`).join(" + ");
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i);
  const index = sum % size;
  return {
    index,
    explanation: `Hash("${key}") = ${chars} = ${sum}. Then ${sum} % ${size} = bucket [${index}]`
  };
}

export default function VisualizerPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<"stack" | "queue" | "list" | "tree" | "hash" | "graph">("stack");
  const [viewMode, setViewMode] = useState<"technical" | "scenario">("technical");

  const [stackMode, setStackMode] = useState<"array" | "list">("array");
  const [queueMode, setQueueMode] = useState<"linear" | "circular" | "deque">("linear");
  const [listMode, setListMode] = useState<"singly" | "doubly">("singly");
  const [treeMode, setTreeMode] = useState<"bst" | "avl" | "heap" | "trie">("bst");
  const [hashMode, setHashMode] = useState<"chaining" | "probing">("chaining");

  const [logMsg, setLogMsg] = useState("");
  const [bstTrace, setBstTrace] = useState<string[]>([]);
  const [hashExplanation, setHashExplanation] = useState("");

  // Stack state
  const [stack, setStack] = useState<string[]>(["Plate 1", "Plate 2", "Plate 3"]);
  const [stackInput, setStackInput] = useState("");
  // Queue state
  const [queue, setQueue] = useState<string[]>(["Alice", "Bob", "Charlie"]);
  const [queueInput, setQueueInput] = useState("");
  // List state
  const [list, setList] = useState<string[]>(["Chest A", "Chest B", "Chest C"]);
  const [listInput, setListInput] = useState("");
  // Tree state
  const [avlRoot, setAvlRoot] = useState<AVLNode | null>(null);
  const [bstRoot, setBstRoot] = useState<AVLNode | null>(null);
  const [treeInput, setTreeInput] = useState("");
  const [heapArray, setHeapArray] = useState<number[]>([80, 70, 60, 50, 40, 30, 20]);
  const [trieWords, setTrieWords] = useState<string[]>(["cat", "car", "dog"]);
  // Hash state
  const [hashBuckets, setHashBuckets] = useState<Array<Array<{ key: string; value: string }>>>(
    Array.from({ length: 8 }, () => [])
  );
  const [probingArray, setProbingArray] = useState<Array<{ key: string; value: string } | null>>(new Array(8).fill(null));
  const [hashKey, setHashKey] = useState("");
  const [hashVal, setHashVal] = useState("");
  // Graph state
  const [vertices, setVertices] = useState<GraphVertex[]>([
    { id: "A", x: 120, y: 80, label: "Station A" },
    { id: "B", x: 300, y: 60, label: "Station B" },
    { id: "C", x: 210, y: 160, label: "Station C" },
    { id: "D", x: 390, y: 150, label: "Station D" }
  ]);
  const [edges, setEdges] = useState<GraphEdge[]>([
    { from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "A", to: "C" }
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeVisNode, setActiveVisNode] = useState<string | null>(null);

  // Theme
  useEffect(() => {
    const t = localStorage.getItem("theme") as "dark" | "light" || "dark";
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("light", next === "light");
  };

  // Default trees
  useEffect(() => {
    let avl = insertAVL(null, 50, () => {});
    avl = insertAVL(avl, 30, () => {}); avl = insertAVL(avl, 70, () => {});
    avl = insertAVL(avl, 20, () => {}); avl = insertAVL(avl, 40, () => {});
    setAvlRoot(avl);
    const bst: AVLNode = { val: 50, height: 3, left: { val: 30, height: 2, left: { val: 20, height: 1, left: null, right: null }, right: { val: 40, height: 1, left: null, right: null } }, right: { val: 70, height: 1, left: null, right: null } };
    setBstRoot(bst);
  }, []);

  // Stack handlers
  const handleStackPush = () => {
    if (!stackInput.trim()) return;
    if (stack.length >= 8) { setLogMsg("🚫 Stack Overflow! Maximum size (8) reached."); return; }
    setStack([...stack, stackInput.trim()]);
    if (viewMode === "scenario") setLogMsg(`🍽️ Added "${stackInput}" on top of the plate pile!`);
    else setLogMsg(`PUSH "${stackInput}" → Stack size: ${stack.length + 1}`);
    setBstTrace([]); setStackInput("");
  };
  const handleStackPop = () => {
    if (stack.length === 0) { setLogMsg("🚫 Stack Underflow! Nothing to pop."); return; }
    const val = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    if (viewMode === "scenario") setLogMsg(`🍽️ Picked up "${val}" from the top of the pile! LIFO in action.`);
    else setLogMsg(`POP → Removed "${val}". Stack size: ${stack.length - 1}`);
    setBstTrace([]);
  };

  // Queue handlers
  const handleQueueEnqueue = () => {
    if (!queueInput.trim()) return;
    if (queue.length >= 8) { setLogMsg("🚫 Queue is full (max 8)."); return; }
    setQueue([...queue, queueInput.trim()]);
    if (viewMode === "scenario") setLogMsg(`🎢 "${queueInput}" joins the water park line at the BACK! FIFO order.`);
    else setLogMsg(`ENQUEUE "${queueInput}" → added at Rear. Size: ${queue.length + 1}`);
    setBstTrace([]); setQueueInput("");
  };
  const handleQueueDequeue = () => {
    if (queue.length === 0) { setLogMsg("🚫 Queue is empty!"); return; }
    const val = queue[0];
    setQueue(queue.slice(1));
    if (viewMode === "scenario") setLogMsg(`🎢 "${val}" reached the front and goes down the slide! They EXIT the queue.`);
    else setLogMsg(`DEQUEUE → Removed "${val}" from Front. Size: ${queue.length - 1}`);
    setBstTrace([]);
  };
  const handleDequePushFront = () => {
    if (!queueInput.trim() || queue.length >= 8) return;
    setQueue([queueInput.trim(), ...queue]);
    setLogMsg(`DEQUE: Pushed "${queueInput}" at FRONT (Priority lane!)`);
    setBstTrace([]); setQueueInput("");
  };
  const handleDequePopRear = () => {
    if (queue.length === 0) return;
    const val = queue[queue.length - 1];
    setQueue(queue.slice(0, -1));
    setLogMsg(`DEQUE: Removed "${val}" from REAR.`);
    setBstTrace([]);
  };

  // List handlers
  const handleListInsertHead = () => {
    if (!listInput.trim()) return;
    setList([listInput.trim(), ...list]);
    if (viewMode === "scenario") setLogMsg(`🗺️ New treasure chest "${listInput}" placed at the START of the hunt!`);
    else setLogMsg(`INSERT HEAD: "${listInput}" → becomes new first node.`);
    setBstTrace([]); setListInput("");
  };
  const handleListInsertTail = () => {
    if (!listInput.trim()) return;
    setList([...list, listInput.trim()]);
    if (viewMode === "scenario") setLogMsg(`🗺️ New treasure chest "${listInput}" placed at the END of the hunt path!`);
    else setLogMsg(`INSERT TAIL: "${listInput}" → becomes last node.`);
    setBstTrace([]); setListInput("");
  };
  const handleListDelete = () => {
    if (list.length === 0) return;
    const val = list[0];
    setList(list.slice(1));
    if (viewMode === "scenario") setLogMsg(`🗺️ Opened and removed chest "${val}" from the beginning of the treasure hunt!`);
    else setLogMsg(`DELETE HEAD: Removed "${val}". New head → "${list[1] || "null"}"`);
    setBstTrace([]);
  };

  // Tree handlers
  const handleTreeInsert = () => {
    const val = parseInt(treeInput);
    if (isNaN(val)) return;
    if (treeMode === "bst") {
      const steps = bstInsertTrace(bstRoot, val);
      setBstTrace(steps);
      const bstInsert = (r: AVLNode | null, v: number): AVLNode => {
        if (!r) return { val: v, height: 1, left: null, right: null };
        if (v < r.val) r.left = bstInsert(r.left, v);
        else if (v > r.val) r.right = bstInsert(r.right, v);
        return r;
      };
      setBstRoot(bstInsert(bstRoot, val));
      setLogMsg(`BST: Inserted ${val}. See step-by-step trace above.`);
    } else if (treeMode === "avl") {
      setAvlRoot(insertAVL(avlRoot, val, setLogMsg));
      setBstTrace([`✅ AVL Tree: Inserted ${val} and auto-balanced tree height.`]);
    } else if (treeMode === "heap") {
      const updated = [...heapArray, val];
      let idx = updated.length - 1;
      const trace: string[] = [`📥 Adding ${val} at index [${idx}].`];
      while (idx > 0) {
        const parentIdx = Math.floor((idx - 1) / 2);
        if (updated[idx] > updated[parentIdx]) {
          trace.push(`⬆️ ${updated[idx]} > parent ${updated[parentIdx]} at [${parentIdx}]. Bubble up (swap).`);
          [updated[idx], updated[parentIdx]] = [updated[parentIdx], updated[idx]];
          idx = parentIdx;
        } else { trace.push(`✅ ${updated[idx]} ≤ parent ${updated[parentIdx]}. Max-Heap property satisfied!`); break; }
      }
      setHeapArray(updated);
      setBstTrace(trace);
      setLogMsg(`Max-Heap: Inserted ${val}.`);
    } else {
      const word = treeInput.toLowerCase().trim();
      if (!trieWords.includes(word)) {
        setTrieWords([...trieWords, word]);
        const chars = word.split("").map((c, i) => `"${word.slice(0, i + 1)}"`).join(" → ");
        setBstTrace([`Trie path: root → ${chars} → [END]`, `Each character is a node in the prefix tree.`]);
        setLogMsg(`Trie: Added word "${word}".`);
      }
    }
    setTreeInput("");
  };

  // Hash handlers
  const handleHashInsert = () => {
    if (!hashKey.trim()) return;
    const key = hashKey.trim();
    const val = hashVal.trim() || "value";
    const { index, explanation } = computeHash(key, 8);
    setHashExplanation(explanation);
    if (hashMode === "chaining") {
      const updated = [...hashBuckets];
      updated[index] = [...updated[index], { key, value: val }];
      setHashBuckets(updated);
      if (updated[index].length > 1) setLogMsg(`Collision at bucket [${index}]! "${key}" chained via Linked List.`);
      else setLogMsg(`"${key}" stored at bucket [${index}].`);
    } else {
      const updated = [...probingArray];
      for (let i = 0; i < 8; i++) {
        const checkIdx = (index + i) % 8;
        if (!updated[checkIdx]) {
          updated[checkIdx] = { key, value: val };
          if (i > 0) setLogMsg(`Collision at [${index}]! Probed ${i} slot(s) forward → placed at [${checkIdx}].`);
          else setLogMsg(`"${key}" placed at slot [${checkIdx}].`);
          setProbingArray(updated);
          break;
        }
      }
    }
    setHashKey(""); setHashVal(""); setBstTrace([]);
  };

  // Graph handlers
  const handleGraphCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    if (vertices.length >= 8) { setLogMsg("Max 8 stations reached."); return; }
    const nextId = String.fromCharCode(65 + vertices.length);
    const stationNames = ["Airport", "City Center", "University", "Hospital", "Mall", "Stadium", "Park", "Museum"];
    setVertices([...vertices, { id: nextId, x, y, label: viewMode === "scenario" ? stationNames[vertices.length] || nextId : nextId }]);
    setLogMsg(viewMode === "scenario" ? `🚇 Added metro station "${stationNames[vertices.length - 1] || nextId}"` : `Vertex "${nextId}" added at (${x}, ${y}).`);
  };

  const handleNodeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedNode) {
      setSelectedNode(id);
      setLogMsg(viewMode === "scenario" ? `🚇 Selected "${vertices.find(v => v.id === id)?.label}". Click another station to add a route.` : `Node "${id}" selected. Click another to connect.`);
    } else {
      if (selectedNode !== id && !edges.some(ed => ed.from === selectedNode && ed.to === id)) {
        setEdges([...edges, { from: selectedNode, to: id }]);
        setLogMsg(viewMode === "scenario" ? `🚇 Route added: ${vertices.find(v => v.id === selectedNode)?.label} → ${vertices.find(v => v.id === id)?.label}` : `Edge: ${selectedNode} → ${id} added.`);
      }
      setSelectedNode(null);
    }
  };

  const runGraphSearch = (alg: "bfs" | "dfs") => {
    if (!vertices.length) return;
    const start = vertices[0].id;
    const visited = new Set<string>();
    const order: string[] = [];
    const adj: Record<string, string[]> = {};
    vertices.forEach(v => adj[v.id] = []);
    edges.forEach(e => { adj[e.from].push(e.to); adj[e.to].push(e.from); });
    if (alg === "bfs") {
      const q = [start]; visited.add(start);
      while (q.length) { const c = q.shift()!; order.push(c); adj[c].forEach(n => { if (!visited.has(n)) { visited.add(n); q.push(n); } }); }
    } else {
      const dfs = (n: string) => { visited.add(n); order.push(n); adj[n].forEach(nb => { if (!visited.has(nb)) dfs(nb); }); };
      dfs(start);
    }
    const labels = order.map(id => vertices.find(v => v.id === id)?.label || id);
    setLogMsg(viewMode === "scenario"
      ? `🚇 Metro ${alg.toUpperCase()} route: ${labels.join(" → ")}`
      : `${alg.toUpperCase()} visited: ${order.join(" → ")}`
    );
    setBstTrace(order.map((id, i) => `Step ${i + 1}: Visit ${alg === "bfs" ? "breadth-level" : "depth-first"} node "${vertices.find(v => v.id === id)?.label || id}"`));
    let step = 0;
    const timer = setInterval(() => {
      if (step < order.length) { setActiveVisNode(order[step]); step++; }
      else { clearInterval(timer); setTimeout(() => setActiveVisNode(null), 1500); }
    }, 600);
  };

  // Tree SVG renderer
  const renderTreeSVG = () => {
    const currentRoot = treeMode === "avl" ? avlRoot : bstRoot;
    const nodes: Array<{ val: number; x: number; y: number; bf?: number }> = [];
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    const assign = (node: AVLNode | null, x: number, y: number, offset: number) => {
      if (!node) return;
      nodes.push({ val: node.val, x, y, bf: getBalance(node) });
      if (node.left) { lines.push({ x1: x, y1: y, x2: x - offset, y2: y + 55 }); assign(node.left, x - offset, y + 55, offset * 0.5); }
      if (node.right) { lines.push({ x1: x, y1: y, x2: x + offset, y2: y + 55 }); assign(node.right, x + offset, y + 55, offset * 0.5); }
    };
    assign(currentRoot, 220, 35, 90);
    return (
      <svg className="w-full h-full min-h-[260px]" viewBox="0 0 440 240">
        {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--border)" strokeWidth="2" />)}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="18" fill="var(--card)" stroke="var(--primary)" strokeWidth="2.5" />
            <text x={n.x} y={n.y + 4} fill="var(--foreground)" fontSize="10" fontWeight="bold" textAnchor="middle">{n.val}</text>
            {treeMode === "avl" && n.bf !== undefined && (
              <text x={n.x + 22} y={n.y - 12} fill={Math.abs(n.bf) > 1 ? "#ef4444" : "#22c55e"} fontSize="8" textAnchor="middle">bf={n.bf}</text>
            )}
          </g>
        ))}
      </svg>
    );
  };

  // Heap SVG renderer
  const heapCoords = [
    { x: 220, y: 25 },
    { x: 130, y: 75 }, { x: 310, y: 75 },
    { x: 80, y: 125 }, { x: 180, y: 125 }, { x: 260, y: 125 }, { x: 360, y: 125 }
  ];

  const scenarioInfo: Record<string, { emoji: string; title: string; description: string }> = {
    stack: { emoji: "🍽️", title: "Cafeteria Plate Stack", description: "Plates are stacked on top of each other. You always pick from the TOP (LIFO - Last In, First Out). Dinner plates work exactly like a Stack!" },
    queue: { emoji: "🎢", title: "Water Park Queue", description: "People line up for the water slide. First person in line gets to go first (FIFO - First In, First Out). Just like a Queue!" },
    list: { emoji: "🗺️", title: "Treasure Hunt Trail", description: "Each chest holds a clue pointing to the NEXT chest location. You follow the chain from start to end — that's a Linked List!" },
    tree: { emoji: "🌳", title: "Family Decision Tree", description: "A BST is like organizing a phonebook: smaller names go LEFT, larger go RIGHT. To find anyone, you compare and go left or right — binary search!" },
    hash: { emoji: "🔐", title: "Gym Locker Assignment", description: "Your locker number is calculated from your name (hash function). When two people get the same locker, the gym chains extra lockers — that's collision chaining!" },
    graph: { emoji: "🚇", title: "Metro Rail Network", description: "Stations are nodes, rail tracks are edges. BFS finds the nearest stations level-by-level. DFS explores one route as deep as possible before backtracking!" }
  };

  const tabItems = [
    { id: "stack", label: "Stack", icon: Layers },
    { id: "queue", label: "Queue", icon: ListOrdered },
    { id: "list", label: "Linked List", icon: ArrowRight },
    { id: "tree", label: "Trees & Heaps", icon: GitBranch },
    { id: "hash", label: "Hash Table", icon: Hash },
    { id: "graph", label: "Graph", icon: Search }
  ];

  const scenario = scenarioInfo[activeTab];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200">

      {/* Navbar */}
      <nav className="border-b border-border bg-slate-900/5 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-foreground transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            AlgoDocs-Interactive | Concept Studio
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-border rounded-xl bg-card p-1">
            <button
              onClick={() => setViewMode("technical")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${viewMode === "technical" ? "bg-primary text-slate-950" : "text-muted hover:text-foreground"}`}
            >
              <FlaskConical className="h-3.5 w-3.5" /> Technical
            </button>
            <button
              onClick={() => setViewMode("scenario")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${viewMode === "scenario" ? "bg-primary text-slate-950" : "text-muted hover:text-foreground"}`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Real-Life
            </button>
          </div>
          <button onClick={toggleTheme} className="p-2 border border-border rounded-xl bg-card hover:bg-slate-800/10 transition cursor-pointer">
            {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid gap-6 lg:grid-cols-[260px_1fr]">

        {/* Sidebar Tabs */}
        <aside className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-muted font-bold px-2">Data Structures</p>
          <div className="flex flex-col gap-2">
            {tabItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id as any); setLogMsg(""); setBstTrace([]); setHashExplanation(""); }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition duration-200 cursor-pointer flex gap-3 items-center ${active ? "bg-primary/10 border-primary/40 text-foreground" : "bg-card border-border/40 text-muted hover:border-border hover:text-foreground"}`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted"}`} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Concept Card */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Info className="h-3.5 w-3.5" /> Key Concept
            </div>
            {activeTab === "stack" && <p className="text-xs text-muted leading-relaxed">Stack is <strong>LIFO</strong> — Last In, First Out. Like a pile of books: you add/remove from the top.</p>}
            {activeTab === "queue" && <p className="text-xs text-muted leading-relaxed">Queue is <strong>FIFO</strong> — First In, First Out. Like a checkout line: first to arrive, first to leave.</p>}
            {activeTab === "list" && <p className="text-xs text-muted leading-relaxed"><strong>Linked List</strong>: each node holds data + a pointer to the next node. No contiguous memory needed.</p>}
            {activeTab === "tree" && <p className="text-xs text-muted leading-relaxed"><strong>BST</strong>: left subtree has smaller values, right has larger. Insert traces show the path taken!</p>}
            {activeTab === "hash" && <p className="text-xs text-muted leading-relaxed"><strong>Hash Table</strong>: key → hash function → bucket index. O(1) avg lookup. Collisions handled by chaining or probing.</p>}
            {activeTab === "graph" && <p className="text-xs text-muted leading-relaxed"><strong>Graph</strong>: set of vertices (nodes) connected by edges. BFS explores level-by-level; DFS goes deep first.</p>}
          </div>
        </aside>

        {/* Right Workspace */}
        <section className="flex flex-col gap-5">

          {/* Real-Life Banner */}
          {viewMode === "scenario" && (
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-indigo-500/10 p-4 flex items-center gap-4">
              <span className="text-4xl">{scenario.emoji}</span>
              <div>
                <h3 className="font-bold text-sm">{scenario.title}</h3>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">{scenario.description}</p>
              </div>
            </div>
          )}

          {/* Sub-Mode Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-border pb-3">
            {activeTab === "stack" && (<>
              <button onClick={() => setStackMode("array")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${stackMode === "array" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Array Stack</button>
              <button onClick={() => setStackMode("list")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${stackMode === "list" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Linked Node Stack</button>
            </>)}
            {activeTab === "queue" && (<>
              <button onClick={() => setQueueMode("linear")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${queueMode === "linear" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Linear Queue</button>
              <button onClick={() => setQueueMode("circular")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${queueMode === "circular" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Circular Buffer</button>
              <button onClick={() => setQueueMode("deque")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${queueMode === "deque" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Deque (Double-Ended)</button>
            </>)}
            {activeTab === "list" && (<>
              <button onClick={() => setListMode("singly")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${listMode === "singly" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Singly Linked</button>
              <button onClick={() => setListMode("doubly")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${listMode === "doubly" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Doubly Linked</button>
            </>)}
            {activeTab === "tree" && (<>
              <button onClick={() => { setTreeMode("bst"); setBstTrace([]); }} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${treeMode === "bst" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>BST</button>
              <button onClick={() => { setTreeMode("avl"); setBstTrace([]); }} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${treeMode === "avl" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>AVL (Self-Balancing)</button>
              <button onClick={() => { setTreeMode("heap"); setBstTrace([]); }} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${treeMode === "heap" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Max Heap</button>
              <button onClick={() => { setTreeMode("trie"); setBstTrace([]); }} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${treeMode === "trie" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Trie</button>
            </>)}
            {activeTab === "hash" && (<>
              <button onClick={() => setHashMode("chaining")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${hashMode === "chaining" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Chaining</button>
              <button onClick={() => setHashMode("probing")} className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${hashMode === "probing" ? "bg-primary text-slate-950" : "bg-card border border-border text-muted hover:text-foreground"}`}>Linear Probing</button>
            </>)}
            {activeTab === "graph" && (
              <span className="text-xs text-muted py-1.5">Click canvas to add stations • Click two stations to connect them</span>
            )}
          </div>

          {/* Main Visual Arena */}
          <div className="rounded-3xl border border-border bg-card p-6 min-h-[340px] flex flex-col gap-4 shadow-soft">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold capitalize">
                  {viewMode === "scenario" ? scenario.title : `${activeTab} Visualization`}
                </h2>
                <p className="text-[11px] text-muted mt-0.5">
                  {viewMode === "scenario" ? "Real-life analogy mode" : `Mode: ${activeTab === "stack" ? stackMode : activeTab === "queue" ? queueMode : activeTab === "list" ? listMode : activeTab === "tree" ? treeMode : activeTab === "hash" ? hashMode : "interactive"}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setStack(viewMode === "scenario" ? ["Plate 1", "Plate 2", "Plate 3"] : ["10", "20", "30"]);
                  setQueue(viewMode === "scenario" ? ["Alice", "Bob", "Charlie"] : ["Apple", "Banana", "Cherry"]);
                  setList(viewMode === "scenario" ? ["Chest A", "Chest B", "Chest C"] : ["Node A", "Node B", "Node C"]);
                  setHeapArray([80, 70, 60, 50, 40, 30, 20]);
                  setTrieWords(["cat", "car", "dog"]);
                  setHashBuckets(Array.from({ length: 8 }, () => []));
                  setProbingArray(new Array(8).fill(null));
                  setVertices([{ id: "A", x: 120, y: 80, label: "Station A" }, { id: "B", x: 300, y: 60, label: "Station B" }, { id: "C", x: 210, y: 160, label: "Station C" }, { id: "D", x: 390, y: 150, label: "Station D" }]);
                  setEdges([{ from: "A", to: "B" }, { from: "B", to: "C" }, { from: "C", to: "D" }, { from: "A", to: "C" }]);
                  setSelectedNode(null); setLogMsg("Workbench reset."); setBstTrace([]); setHashExplanation("");
                }}
                className="p-2 border border-border rounded-xl bg-background/50 text-muted hover:text-foreground transition flex gap-1.5 items-center text-xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>

            {/* Visual Canvas */}
            <div className="flex-1 flex items-center justify-center min-h-[220px]">

              {/* STACK */}
              {activeTab === "stack" && stackMode === "array" && (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-[10px] text-muted uppercase font-bold mb-1">← TOP (index {stack.length - 1})</div>
                  <div className="flex flex-col items-center justify-end min-h-[180px] w-56 border-b-4 border-x-4 border-slate-400 rounded-b-2xl px-3 py-2 gap-2 bg-slate-900/5 relative">
                    {stack.length === 0
                      ? <div className="text-muted text-xs italic">Empty Stack</div>
                      : [...stack].reverse().map((val, i) => (
                        <div key={i} className={`w-full py-2.5 text-center font-mono font-bold text-xs border rounded-xl transition-all ${i === 0 ? "bg-primary/20 border-primary text-primary scale-105 shadow-md" : "bg-card border-border text-muted"}`}>
                          {viewMode === "scenario" ? `${i === 0 ? "👆 " : ""}${val}` : `[${stack.length - 1 - i}] ${val}`}
                        </div>
                      ))
                    }
                  </div>
                  <div className="text-[10px] text-muted uppercase font-bold">BOTTOM (index 0)</div>
                </div>
              )}

              {activeTab === "stack" && stackMode === "list" && (
                <div className="flex flex-col gap-3 items-center">
                  <div className="text-[10px] text-muted font-bold mb-1">TOP → NULL chain below</div>
                  {stack.length === 0
                    ? <div className="text-muted text-xs italic">Empty Linked Stack</div>
                    : [...stack].reverse().map((val, i) => (
                      <React.Fragment key={i}>
                        <div className={`p-3 border-2 rounded-xl font-mono text-xs text-center min-w-[140px] flex justify-between items-center px-4 ${i === 0 ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                          <span className="font-bold">{val}</span>
                          <span className="text-[9px] text-muted border border-border rounded px-1">→ next</span>
                        </div>
                        {i < stack.length - 1 && <span className="text-base text-muted">↓</span>}
                      </React.Fragment>
                    ))
                  }
                  <div className="text-[10px] text-slate-500 border border-dashed border-border rounded px-3 py-1">NULL</div>
                </div>
              )}

              {/* QUEUE */}
              {activeTab === "queue" && queueMode === "circular" && (
                <div className="relative w-52 h-52 rounded-full border-4 border-dashed border-border flex items-center justify-center">
                  <div className="absolute text-[9px] text-muted uppercase font-bold text-center">Circular<br />Buffer</div>
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const angle = (idx * 360) / 8 - 90;
                    const rad = (angle * Math.PI) / 180;
                    const x = 82 * Math.cos(rad);
                    const y = 82 * Math.sin(rad);
                    const hasVal = idx < queue.length;
                    return (
                      <div key={idx} style={{ transform: `translate(${x}px, ${y}px)` }} className={`absolute w-11 h-11 rounded-full border-2 flex flex-col items-center justify-center font-mono text-[8px] font-bold transition-all ${hasVal ? "border-primary bg-primary/15 text-primary scale-110" : "border-border bg-card text-muted"}`}>
                        <span>{hasVal ? queue[idx] : "·"}</span>
                        <span className="text-[6px] text-slate-500">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "queue" && queueMode !== "circular" && (
                <div className="flex flex-col items-center gap-4 w-full">
                  {viewMode === "scenario" && (
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span className="font-bold text-emerald-500">🎢 SLIDE (Exit)</span>
                      <span className="text-slate-400">←←←←←←←←←←</span>
                      <span className="font-bold text-indigo-500">LINE (Entry) 🎢</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 overflow-x-auto p-2 max-w-full">
                    {queue.length === 0
                      ? <div className="text-muted text-xs italic">Empty Queue</div>
                      : queue.map((val, idx) => {
                        const isFront = idx === 0;
                        const isRear = idx === queue.length - 1;
                        return (
                          <React.Fragment key={idx}>
                            <div className={`border-2 rounded-2xl p-3 min-w-[80px] text-center font-mono text-xs relative flex flex-col gap-1 transition-all ${isFront ? "border-emerald-400 bg-emerald-500/10 text-emerald-600 scale-105" : isRear ? "border-indigo-400 bg-indigo-500/10 text-indigo-600 scale-105" : "border-border bg-card"}`}>
                              <span className="text-base">{viewMode === "scenario" ? "🧑" : ""}</span>
                              <span className="font-bold">{val}</span>
                              {(isFront || isRear) && <span className="text-[8px] font-bold uppercase">{isFront ? "Front" : "Rear"}</span>}
                            </div>
                            {idx < queue.length - 1 && <ArrowRight className="h-4 w-4 text-muted shrink-0" />}
                          </React.Fragment>
                        );
                      })
                    }
                  </div>
                  {queueMode === "deque" && <p className="text-[10px] text-muted">⬅️ Can insert/remove from BOTH ends ➡️</p>}
                </div>
              )}

              {/* LINKED LIST */}
              {activeTab === "list" && (
                <div className="flex items-center gap-3 overflow-x-auto p-4 max-w-full">
                  <div className="text-[10px] font-bold text-muted shrink-0">HEAD →</div>
                  {list.length === 0
                    ? <div className="text-muted text-xs italic">Empty List</div>
                    : list.map((val, idx) => (
                      <React.Fragment key={idx}>
                        <div className="border-2 border-border bg-card rounded-2xl overflow-hidden text-xs min-w-[100px]">
                          <div className="bg-primary/10 px-3 py-2 font-mono font-bold text-center border-b border-border">{val}</div>
                          <div className="px-3 py-1.5 text-[9px] text-muted font-mono text-center">
                            {listMode === "doubly" ? "prev | next" : "next →"}
                          </div>
                        </div>
                        {idx < list.length - 1 && (
                          <div className="font-bold text-primary text-base shrink-0">{listMode === "doubly" ? "⇄" : "→"}</div>
                        )}
                      </React.Fragment>
                    ))
                  }
                  <div className="text-[10px] font-bold text-slate-500 shrink-0">→ NULL</div>
                </div>
              )}

              {/* TREE */}
              {activeTab === "tree" && (treeMode === "bst" || treeMode === "avl") && (
                <div className="w-full">{renderTreeSVG()}</div>
              )}

              {activeTab === "tree" && treeMode === "heap" && (
                <div className="w-full space-y-5">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {heapArray.map((val, idx) => (
                      <div key={idx} className="border-2 border-primary/30 bg-primary/10 rounded-xl p-2.5 font-mono text-xs font-bold text-center min-w-[44px]">
                        <div className="text-foreground">{val}</div>
                        <div className="text-[8px] text-muted">[{idx}]</div>
                        {idx > 0 && <div className="text-[7px] text-slate-500">parent[{Math.floor((idx - 1) / 2)}]</div>}
                      </div>
                    ))}
                  </div>
                  <svg className="w-full h-[150px]" viewBox="0 0 440 140">
                    {/* Lines */}
                    {[1,2,3,4,5,6].map(i => {
                      const pi = Math.floor((i-1)/2);
                      const c = heapCoords[i]; const p = heapCoords[pi];
                      if (!c || !p || i >= heapArray.length) return null;
                      return <line key={i} x1={p.x} y1={p.y} x2={c.x} y2={c.y} stroke="var(--border)" strokeWidth="2" />;
                    })}
                    {heapArray.slice(0, 7).map((val, i) => {
                      const coord = heapCoords[i];
                      if (!coord) return null;
                      return (
                        <g key={i}>
                          <circle cx={coord.x} cy={coord.y} r="18" fill="var(--card)" stroke={i === 0 ? "#f59e0b" : "var(--primary)"} strokeWidth="2.5" />
                          <text x={coord.x} y={coord.y + 4} fill="var(--foreground)" fontSize="10" fontWeight="bold" textAnchor="middle">{val}</text>
                          <text x={coord.x} y={coord.y - 22} fill="var(--muted)" fontSize="7" textAnchor="middle">[{i}]</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {activeTab === "tree" && treeMode === "trie" && (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {trieWords.map((w, i) => (
                      <span key={i} className="bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-bold px-3 py-1.5 rounded-full">
                        {w.split("").join(" → ")}
                      </span>
                    ))}
                  </div>
                  <svg className="w-72 h-44" viewBox="0 0 240 160">
                    <circle cx="120" cy="18" r="12" fill="none" stroke="var(--border)" strokeDasharray="3" />
                    <text x="120" y="22" fill="var(--muted)" fontSize="8" textAnchor="middle">root</text>
                    {/* Static trie for cat/car/dog */}
                    <line x1="120" y1="30" x2="65" y2="60" stroke="var(--border)" />
                    <line x1="120" y1="30" x2="175" y2="60" stroke="var(--border)" />
                    <circle cx="65" cy="68" r="12" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
                    <text x="65" y="72" fill="var(--foreground)" fontSize="9" fontWeight="bold" textAnchor="middle">c</text>
                    <circle cx="175" cy="68" r="12" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
                    <text x="175" y="72" fill="var(--foreground)" fontSize="9" fontWeight="bold" textAnchor="middle">d</text>
                    <line x1="65" y1="80" x2="65" y2="108" stroke="var(--border)" />
                    <circle cx="65" cy="116" r="12" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
                    <text x="65" y="120" fill="var(--foreground)" fontSize="9" fontWeight="bold" textAnchor="middle">a</text>
                    <line x1="55" y1="128" x2="42" y2="148" stroke="var(--border)" />
                    <line x1="75" y1="128" x2="88" y2="148" stroke="var(--border)" />
                    <circle cx="42" cy="152" r="9" fill="var(--card)" stroke="#22c55e" strokeWidth="2" />
                    <text x="42" y="155" fill="var(--foreground)" fontSize="7" fontWeight="bold" textAnchor="middle">t✓</text>
                    <circle cx="88" cy="152" r="9" fill="var(--card)" stroke="#22c55e" strokeWidth="2" />
                    <text x="88" y="155" fill="var(--foreground)" fontSize="7" fontWeight="bold" textAnchor="middle">r✓</text>
                    <line x1="175" y1="80" x2="175" y2="108" stroke="var(--border)" />
                    <circle cx="175" cy="116" r="12" fill="var(--card)" stroke="var(--primary)" strokeWidth="2" />
                    <text x="175" y="120" fill="var(--foreground)" fontSize="9" fontWeight="bold" textAnchor="middle">o</text>
                    <line x1="175" y1="128" x2="175" y2="148" stroke="var(--border)" />
                    <circle cx="175" cy="152" r="9" fill="var(--card)" stroke="#22c55e" strokeWidth="2" />
                    <text x="175" y="155" fill="var(--foreground)" fontSize="7" fontWeight="bold" textAnchor="middle">g✓</text>
                  </svg>
                  <p className="text-[10px] text-muted">✓ = word ends here. Each path from root = a stored word prefix.</p>
                </div>
              )}

              {/* HASH TABLE */}
              {activeTab === "hash" && hashMode === "chaining" && (
                <div className="w-full max-w-lg space-y-1.5">
                  {hashBuckets.map((bucket, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 border border-border bg-card/60 rounded-xl text-xs font-mono">
                      <div className="w-16 shrink-0">
                        <div className="bg-primary/10 border border-primary/30 rounded-lg px-2 py-1.5 text-center font-bold text-primary">
                          [{idx}]
                        </div>
                      </div>
                      <span className="text-slate-500">→</span>
                      <div className="flex items-center gap-1.5 flex-wrap flex-1">
                        {bucket.length === 0
                          ? <span className="text-slate-500 italic">null</span>
                          : bucket.map((item, bIdx) => (
                            <React.Fragment key={bIdx}>
                              <span className="bg-card border-2 border-border px-2.5 py-1 rounded-lg text-foreground font-bold">
                                {viewMode === "scenario" ? `🔑 ${item.key}` : `${item.key}:${item.value}`}
                              </span>
                              {bIdx < bucket.length - 1 && <span className="text-primary font-bold text-base">→</span>}
                            </React.Fragment>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "hash" && hashMode === "probing" && (
                <div className="w-full max-w-sm">
                  <div className="grid grid-cols-4 gap-2">
                    {probingArray.map((cell, idx) => (
                      <div key={idx} className={`border-2 rounded-xl p-2.5 text-center font-mono text-[10px] transition-all ${cell ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                        <div className="text-slate-500 text-[8px] mb-1">[{idx}]</div>
                        {cell
                          ? <div className="font-bold text-foreground">{viewMode === "scenario" ? `🔐 ${cell.key}` : `${cell.key}`}</div>
                          : <div className="text-slate-500 italic">empty</div>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GRAPH */}
              {activeTab === "graph" && (
                <div className="w-full border border-border rounded-2xl overflow-hidden bg-slate-950/10 relative">
                  <div className="absolute top-2 left-2 text-[9px] uppercase font-bold text-muted select-none z-10">
                    {viewMode === "scenario" ? "🚇 Metro Map — Click to add stations" : "Click canvas to add nodes | Click nodes to connect"}
                  </div>
                  <svg onClick={handleGraphCanvasClick} className="w-full h-64 cursor-crosshair">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border)" />
                      </marker>
                    </defs>
                    {edges.map((edge, i) => {
                      const from = vertices.find(v => v.id === edge.from);
                      const to = vertices.find(v => v.id === edge.to);
                      if (!from || !to) return null;
                      return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="var(--border)" strokeWidth="2.5" markerEnd="url(#arrow)" />;
                    })}
                    {vertices.map((v) => {
                      const isSel = selectedNode === v.id;
                      const isActive = activeVisNode === v.id;
                      return (
                        <g key={v.id} onClick={(e) => handleNodeClick(v.id, e)} className="cursor-pointer">
                          <circle cx={v.x} cy={v.y} r={isSel ? 22 : 18} fill={isSel ? "var(--primary)" : isActive ? "#f59e0b" : "var(--card)"} stroke={isSel ? "#fff" : "var(--primary)"} strokeWidth="2.5" className="transition-all duration-200" />
                          <text x={v.x} y={v.y + 4} fill={isSel || isActive ? "#0f172a" : "var(--foreground)"} fontSize="10" fontWeight="bold" textAnchor="middle">{v.id}</text>
                          {viewMode === "scenario" && (
                            <text x={v.x} y={v.y + 32} fill="var(--muted)" fontSize="7" textAnchor="middle">{v.label}</text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>

            {/* Log Console */}
            <div className="border-t border-border pt-4 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-muted font-bold">Operation Log</p>
              <div className="bg-slate-900/5 border border-border rounded-xl px-4 py-2.5 min-h-[38px] flex items-center text-xs font-mono">
                {logMsg || "Perform an operation to see detailed output here."}
              </div>
            </div>
          </div>

          {/* Step-by-Step Trace Panel */}
          {bstTrace.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold">Step-by-Step Trace</h3>
              </div>
              <div className="space-y-2">
                {bstTrace.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full shrink-0">Step {i + 1}</span>
                    <span className="text-muted leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hash Explanation Panel */}
          {hashExplanation && (
            <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-400">Hash Function Breakdown</h3>
              </div>
              <p className="text-xs font-mono text-muted leading-relaxed">{hashExplanation}</p>
            </div>
          )}

          {/* Controls Console */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h3 className="text-xs uppercase tracking-wider text-muted font-bold mb-4">Operations Console</h3>

            {activeTab === "stack" && (
              <div className="flex flex-wrap gap-3 items-center">
                <input type="text" placeholder={viewMode === "scenario" ? "Plate name..." : "Push value..."} value={stackInput} onChange={e => setStackInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleStackPush()} className="h-10 px-3 border border-border bg-background rounded-xl outline-none focus:border-primary text-xs w-36" />
                <button onClick={handleStackPush} className="h-10 px-4 rounded-xl bg-primary text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90">
                  <Plus className="h-3.5 w-3.5" /> {viewMode === "scenario" ? "Stack a Plate" : "Push"}
                </button>
                <button onClick={handleStackPop} className="h-10 px-4 rounded-xl border border-border text-foreground font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-800/10">
                  <Minus className="h-3.5 w-3.5" /> {viewMode === "scenario" ? "Take a Plate" : "Pop"}
                </button>
              </div>
            )}

            {activeTab === "queue" && (
              <div className="flex flex-wrap gap-3 items-center">
                <input type="text" placeholder={viewMode === "scenario" ? "Person name..." : "Queue element..."} value={queueInput} onChange={e => setQueueInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleQueueEnqueue()} className="h-10 px-3 border border-border bg-background rounded-xl outline-none focus:border-primary text-xs w-36" />
                {queueMode === "deque" ? (<>
                  <button onClick={handleDequePushFront} className="h-10 px-3 rounded-xl bg-primary text-slate-950 font-bold text-xs cursor-pointer">Push Front</button>
                  <button onClick={handleQueueEnqueue} className="h-10 px-3 rounded-xl bg-primary text-slate-950 font-bold text-xs cursor-pointer">Push Rear</button>
                  <button onClick={handleQueueDequeue} className="h-10 px-3 rounded-xl border border-border text-foreground font-bold text-xs cursor-pointer">Pop Front</button>
                  <button onClick={handleDequePopRear} className="h-10 px-3 rounded-xl border border-border text-foreground font-bold text-xs cursor-pointer">Pop Rear</button>
                </>) : (<>
                  <button onClick={handleQueueEnqueue} className="h-10 px-4 rounded-xl bg-primary text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-90">
                    <Plus className="h-3.5 w-3.5" /> {viewMode === "scenario" ? "Join Queue" : "Enqueue"}
                  </button>
                  <button onClick={handleQueueDequeue} className="h-10 px-4 rounded-xl border border-border text-foreground font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-slate-800/10">
                    <Minus className="h-3.5 w-3.5" /> {viewMode === "scenario" ? "Enter Slide" : "Dequeue"}
                  </button>
                </>)}
              </div>
            )}

            {activeTab === "list" && (
              <div className="flex flex-wrap gap-3 items-center">
                <input type="text" placeholder={viewMode === "scenario" ? "Chest name..." : "Node value..."} value={listInput} onChange={e => setListInput(e.target.value)} className="h-10 px-3 border border-border bg-background rounded-xl outline-none focus:border-primary text-xs w-36" />
                <button onClick={handleListInsertHead} className="h-10 px-4 rounded-xl bg-primary text-slate-950 font-bold text-xs cursor-pointer hover:opacity-90">
                  {viewMode === "scenario" ? "Add to Start" : "Insert Head"}
                </button>
                <button onClick={handleListInsertTail} className="h-10 px-4 rounded-xl bg-primary text-slate-950 font-bold text-xs cursor-pointer hover:opacity-90">
                  {viewMode === "scenario" ? "Add to End" : "Insert Tail"}
                </button>
                <button onClick={handleListDelete} className="h-10 px-4 rounded-xl border border-border text-foreground font-bold text-xs cursor-pointer hover:bg-slate-800/10">
                  {viewMode === "scenario" ? "Open First Chest" : "Delete Head"}
                </button>
              </div>
            )}

            {activeTab === "tree" && (
              <div className="flex flex-wrap gap-3 items-center">
                <input type="text" placeholder={treeMode === "trie" ? "Enter word (e.g. map)" : "Enter number (e.g. 45)"} value={treeInput} onChange={e => setTreeInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleTreeInsert()} className="h-10 px-3 border border-border bg-background rounded-xl outline-none focus:border-primary text-xs w-44" />
                <button onClick={handleTreeInsert} className="h-10 px-4 rounded-xl bg-primary text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer hover:opacity-90">
                  <Plus className="h-3.5 w-3.5" /> Insert & Trace
                </button>
                <button onClick={() => { setBstRoot(null); setAvlRoot(null); setHeapArray([]); setTrieWords([]); setBstTrace([]); setLogMsg("Tree cleared."); }} className="h-10 px-4 rounded-xl border border-border text-foreground font-bold text-xs cursor-pointer hover:bg-slate-800/10">
                  Clear Tree
                </button>
              </div>
            )}

            {activeTab === "hash" && (
              <div className="flex flex-wrap gap-3 items-center">
                <input type="text" placeholder={viewMode === "scenario" ? "Member name..." : "Key (e.g. Alice)"} value={hashKey} onChange={e => setHashKey(e.target.value)} className="h-10 px-3 border border-border bg-background rounded-xl text-xs w-36 outline-none focus:border-primary" />
                <input type="text" placeholder={viewMode === "scenario" ? "Locker #..." : "Value (e.g. 98)"} value={hashVal} onChange={e => setHashVal(e.target.value)} className="h-10 px-3 border border-border bg-background rounded-xl text-xs w-28 outline-none focus:border-primary" />
                <button onClick={handleHashInsert} className="h-10 px-4 rounded-xl bg-primary text-slate-950 font-bold text-xs cursor-pointer hover:opacity-90">
                  {viewMode === "scenario" ? "Assign Locker" : "Store Key-Value"}
                </button>
              </div>
            )}

            {activeTab === "graph" && (
              <div className="flex flex-wrap gap-3 items-center">
                <button onClick={() => runGraphSearch("bfs")} className="h-10 px-4 rounded-xl bg-primary text-slate-950 font-bold text-xs cursor-pointer hover:opacity-90">
                  {viewMode === "scenario" ? "🚇 BFS Route Scan" : "BFS Traversal"}
                </button>
                <button onClick={() => runGraphSearch("dfs")} className="h-10 px-4 rounded-xl bg-primary text-slate-950 font-bold text-xs cursor-pointer hover:opacity-90">
                  {viewMode === "scenario" ? "🚇 DFS Route Explore" : "DFS Traversal"}
                </button>
                <button onClick={() => { setVertices([]); setEdges([]); setLogMsg("Graph cleared."); setBstTrace([]); }} className="h-10 px-4 rounded-xl border border-border text-foreground font-semibold text-xs cursor-pointer hover:bg-slate-800/10">
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Diataxis Topic-Based Technical Documentation Spec */}
          <div className="mt-4">
            <TopicDocsSpec activeTab={activeTab} />
          </div>

        </section>
      </main>
    </div>
  );
}
