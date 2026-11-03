"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = () => {
    setMessage("Entering as Guest. Redirecting...");
    localStorage.setItem("user", JSON.stringify({ email: "guest@algovision.ai", name: "Guest Learner", role: "guest" }));
    setTimeout(() => router.push("/dashboard"), 600);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not create account");
      }

      localStorage.setItem("user", JSON.stringify({ email: form.email, name: `${form.firstName} ${form.lastName}` }));
      setMessage("Account created successfully. Redirecting to your dashboard...");
      setTimeout(() => router.push("/dashboard"), 600);
    } catch (error) {
      console.warn("Backend signup failed, fallback to guest:", error);
      setIsError(false);
      setMessage("Backend offline. Automatically launching Guest Mode...");
      localStorage.setItem("user", JSON.stringify({ email: form.email || "guest@algovision.ai", name: `${form.firstName || "Guest"} ${form.lastName || "Learner"}`.trim(), role: "guest" }));
      setTimeout(() => router.push("/dashboard"), 1200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create your student account</h1>
          <p className="mt-2 text-sm text-slate-300">Join AlgoVision and start visualizing DSA right away.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} type="text" placeholder="First name" className="h-11 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm outline-none ring-0 focus:border-cyan-400 focus:bg-slate-900" />
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} type="text" placeholder="Last name" className="h-11 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm outline-none ring-0 focus:border-cyan-400 focus:bg-slate-900" />
          </div>
          <input required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email address" className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm outline-none ring-0 focus:border-cyan-400 focus:bg-slate-900" />
          <input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password" className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm outline-none ring-0 focus:border-cyan-400 focus:bg-slate-900" />
          <button className="h-11 w-full rounded-xl bg-cyan-400 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-70 cursor-pointer" type="submit" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <span className="relative bg-slate-950 px-3 text-xs uppercase tracking-wider text-slate-400">or</span>
        </div>

        <button 
          onClick={handleGuestLogin}
          className="h-11 w-full rounded-xl border border-dashed border-cyan-400/40 bg-cyan-400/5 font-semibold text-cyan-300 hover:bg-cyan-400/10 transition cursor-pointer"
        >
          Continue as Guest (No Setup Required)
        </button>

        {message ? <p className={`mt-4 text-center text-sm ${isError ? "text-rose-300" : "text-emerald-300"}`}>{message}</p> : null}

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-cyan-300 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

