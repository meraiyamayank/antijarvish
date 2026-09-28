"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { StatCard } from "@/components/StatCard";
import {
  Activity,
  Layers,
  HardDrive,
  Key,
  Shield,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const res = await apiRequest("/api/dashboard/stats/");
    if (res.success && res.data) {
      setStats(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchStats();
    }
  }, [user, authLoading, router]);

  if (authLoading || (!stats && loading)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back, {user?.first_name || user?.email.split("@")[0]}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {user?.role} Tier
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Connected to autonomous workspace • Member since {stats?.member_since || "recently"}
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Metrics</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <StatCard
          title="Daily API Calls"
          value={`${stats?.api_calls_today || 0} / ${stats?.api_quota_limit || 5000}`}
          change="Normal"
          changePositive={true}
          icon={Activity}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Active Projects"
          value={stats?.active_projects || 0}
          change="+1 this week"
          changePositive={true}
          icon={Layers}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Storage Allocated"
          value={`${stats?.storage_used_mb || 0} MB`}
          change="8.4% of quota"
          changePositive={true}
          icon={HardDrive}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Subscription Status"
          value={stats?.status || "Active"}
          change="Verified"
          changePositive={true}
          icon={Shield}
          iconColor="text-purple-400"
        />
      </div>

      {/* Features & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Left: Active Workspace Services */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Active System Services</h2>
            <span className="text-xs text-slate-400 font-mono">Real-time status</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Django REST API Engine</h3>
                  <p className="text-xs text-slate-400">JWT Authentication, RBAC filters, API health probes</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-semibold text-white">PostgreSQL Data Warehouse</h3>
                  <p className="text-xs text-slate-400">Schema migrations versioned, relational integrity enforced</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Next.js Edge Runtime</h3>
                  <p className="text-xs text-slate-400">Responsive SSR, client hydration, and auth routing</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/50">
          <h2 className="text-lg font-bold text-white mb-4">Quick Developer Actions</h2>
          <div className="space-y-3">
            <a
              href="/api/health/"
              target="_blank"
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>API Health Probe</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </a>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Active Session Token</span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 truncate">
                Bearer eyJhbGciOiJIUzI1Ni...
              </p>
              <span className="inline-block mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Valid for 60 minutes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
