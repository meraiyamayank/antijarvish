import Link from "next/link";
import { Terminal, Shield, Zap, Database, ArrowRight, CheckCircle2, Lock, Cpu, Server } from "lucide-react";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 mb-8 shadow-inner">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>JARVIS v1 Production SaaS Architecture</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-mono">Antigravity Integrated</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Autonomous Software Engineering with <span className="gradient-text">JARVIS</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Production-grade full-stack platform featuring Next.js 14, Django REST Framework,
          PostgreSQL, Role-Based Access Control, and containerized cloud deployment.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
          >
            <span>Create Account</span>
          </Link>
        </div>

        {/* Architecture Stack Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-sm text-slate-200">Next.js 14 Frontend</span>
            </div>
            <p className="text-xs text-slate-400">TypeScript, App Router, Tailwind CSS, responsive dashboards.</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center space-x-3 mb-2">
              <Server className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-sm text-slate-200">Django REST API</span>
            </div>
            <p className="text-xs text-slate-400">Python 3, SimpleJWT authentication, CORS headers, service layer.</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center space-x-3 mb-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-sm text-slate-200">RBAC Security</span>
            </div>
            <p className="text-xs text-slate-400">Granular permissions separating Admin management from Member spaces.</p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-slate-800/80 bg-slate-900/40">
            <div className="flex items-center space-x-3 mb-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-sm text-slate-200">PostgreSQL Ready</span>
            </div>
            <p className="text-xs text-slate-400">Production migrations, ACID compliance, Dockerized compose profiles.</p>
          </div>
        </div>

        {/* Live Seeded Credentials Section */}
        <div className="mt-20 max-w-3xl mx-auto glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span>Pre-configured Demo Accounts</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Ready for testing RBAC flows immediately.</p>
            </div>
            <span className="text-xs font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md">
              Seeded in DB
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">Administrator</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">Full Control</span>
              </div>
              <p className="text-xs font-mono text-slate-300 mt-1">Email: <span className="text-white">admin@jarvis.local</span></p>
              <p className="text-xs font-mono text-slate-300">Password: <span className="text-white">AdminPassword123!</span></p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Member / Subscriber</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">Standard User</span>
              </div>
              <p className="text-xs font-mono text-slate-300 mt-1">Email: <span className="text-white">member@jarvis.local</span></p>
              <p className="text-xs font-mono text-slate-300">Password: <span className="text-white">MemberPassword123!</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
