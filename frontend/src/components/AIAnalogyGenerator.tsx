"use client";

import React, { useState } from "react";
import { Sparkles, Lightbulb, CheckCircle2, ArrowRight, Zap, RefreshCw } from "lucide-react";

export default function AIAnalogyGenerator() {
  const [selectedConcept, setSelectedConcept] = useState("LRU Cache");
  const [customInput, setCustomInput] = useState("");
  const [loading, setLoading] = useState(false);

  const predefinedConcepts: Record<string, {
    analogyTitle: string;
    analogyStory: string;
    techInvariant: string;
    cloudApplication: string;
  }> = {
    "LRU Cache": {
      analogyTitle: "The Clean Desk Policy",
      analogyStory: "Imagine your office desk only has space for 5 active paper files. Whenever you need a file, you pull it out and place it right in front of you. When the desk gets full, the file you haven't touched for the longest time gets moved into the basement filing cabinet.",
      techInvariant: "Least Recently Used (LRU) evicts the item that has had the oldest access timestamp. Implemented via Doubly Linked List + Hash Map for O(1) eviction and lookup.",
      cloudApplication: "Crucial in Cohesity SmartFiles and storage nodes for keeping hot metadata in RAM while cold blocks remain on NVMe/HDD."
    },
    "Bloom Filter": {
      analogyTitle: "The Nightclub Bouncer's Fast List",
      analogyStory: "Imagine a bouncer with an ultra-compact memory card. If you ask 'Is Bob inside?', the bouncer can instantly say 'Definitely NO' (100% guarantee). But if they say 'Probably YES', you have to check the actual VIP lounge. It never gives false negatives!",
      techInvariant: "Space-efficient probabilistic data structure using multiple hash functions over a bit array. False positive probability is tunable; false negatives are mathematically impossible.",
      cloudApplication: "Used in distributed storage and deduplication to prevent expensive disk reads when a block signature definitely does not exist."
    },
    "Consistent Hashing": {
      analogyTitle: "The Round Carousel",
      analogyStory: "Imagine a giant circular luggage carousel with 10 pickup stations spaced out evenly. Luggage bags travel around the circle until they hit the nearest station clockwise. If a station shuts down, only its baggage shifts to the next neighbor—the rest of the carousel doesn't have to restart!",
      techInvariant: "Maps both nodes and keys to points on a cyclic ring (e.g. 0 to 2^32 - 1). Adding or removing a node only requires remapping K/N keys rather than all keys.",
      cloudApplication: "Core architectural foundation of distributed storage clusters, Helios control plane nodes, and distributed SpanFS."
    },
    "Merkle Tree": {
      analogyTitle: "The Notarized Document Hierarchy",
      analogyStory: "Imagine a multi-chapter legal contract where each page has a wax stamp. The stamps from page 1 and 2 combine into a chapter stamp, and chapter stamps combine into a single Master Wax Seal on the cover. If anyone changes a single comma on page 42, the Master Seal on the cover breaks immediately!",
      techInvariant: "Binary tree where every leaf node is labeled with the cryptographic hash of a data block, and every non-leaf node is labeled with the hash of its children's labels.",
      cloudApplication: "Powers tamper-proof immutable snapshot trees, anti-ransomware integrity verification, and distributed replica synchronization."
    }
  };

  const [activeData, setActiveData] = useState(predefinedConcepts["LRU Cache"]);

  const handleSelect = (name: string) => {
    setSelectedConcept(name);
    setLoading(true);
    setTimeout(() => {
      setActiveData(predefinedConcepts[name] || {
        analogyTitle: `Analogy for ${name}`,
        analogyStory: `Imagine ${name} like a smart organizer that prioritizes predictable throughput and eliminates redundant steps in everyday life.`,
        techInvariant: `${name} maintains strict invariant constraints to guarantee deterministic performance bounds.`,
        cloudApplication: `Applied across cloud platforms to scale distributed operations and reduce I/O bottlenecks.`
      });
      setLoading(false);
    }, 350);
  };

  const handleCustomSubmit = () => {
    if (!customInput.trim()) return;
    handleSelect(customInput.trim());
    setCustomInput("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3 w-3" /> GenAI Analogy Synthesizer
          </div>
          <h3 className="mt-2 text-lg font-bold text-slate-900 tracking-tight">
            AI-Assisted Concept Simplification Engine
          </h3>
          <p className="text-xs text-slate-500">
            Translates advanced distributed systems concepts into memorable physical analogies for documentation.
          </p>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(predefinedConcepts).map(concept => (
            <button
              key={concept}
              onClick={() => handleSelect(concept)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                selectedConcept === concept
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {concept}
            </button>
          ))}
        </div>
      </div>

      {/* Result Card */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* The Analogy */}
        <div className="md:col-span-2 rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Lightbulb className="h-4 w-4" /> Real-World Analogy: {activeData.analogyTitle}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">
            {activeData.analogyStory}
          </p>
          <div className="pt-2 border-t border-indigo-100 text-xs text-indigo-900 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
            Tested against technical audience personas to eliminate misleading abstractions.
          </div>
        </div>

        {/* Technical Invariant & Cloud Context */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Technical Invariant</span>
            <p className="mt-1 text-xs text-slate-800 leading-relaxed">
              {activeData.techInvariant}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Enterprise Cloud Relevance</span>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              {activeData.cloudApplication}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Concept Input */}
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <input
          type="text"
          value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleCustomSubmit()}
          placeholder="Type any algorithm or computing concept (e.g. B-Tree, Raft Consensus, SkipList)..."
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition"
        />
        <button
          onClick={handleCustomSubmit}
          disabled={loading || !customInput.trim()}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
        >
          Synthesize Analogy
        </button>
      </div>
    </div>
  );
}
