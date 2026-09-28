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
  ArrowUpRight,
  RefreshCw,
  Plus,
  Copy,
  Check,
  Trash2,
  Terminal,
  AlertTriangle,
} from "lucide-react";

interface ApiKeyItem {
  id: number;
  name: string;
  prefix: string;
  scopes: string[];
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [keysLoading, setKeysLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newlyGeneratedSecret, setNewlyGeneratedSecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [keyError, setKeyError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    const res = await apiRequest("/api/dashboard/stats/");
    if (res.success && res.data) {
      setStats(res.data);
    }
    setLoading(false);
  };

  const fetchApiKeys = async () => {
    setKeysLoading(true);
    const res = await apiRequest<ApiKeyItem[]>("/api/apikeys/");
    if (res.success && Array.isArray(res.data)) {
      setApiKeys(res.data);
    }
    setKeysLoading(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchStats();
      fetchApiKeys();
    }
  }, [user, authLoading, router]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setGeneratingKey(true);
    setKeyError("");
    const res = await apiRequest("/api/apikeys/", {
      method: "POST",
      body: JSON.stringify({ name: newKeyName.trim(), scopes: ["read", "write"] }),
    });

    if (res.success && res.data?.secret_key) {
      setNewlyGeneratedSecret(res.data.secret_key);
      setNewKeyName("");
      fetchApiKeys();
    } else {
      setKeyError(res.error?.message || "Failed to generate API key.");
    }
    setGeneratingKey(false);
  };

  const handleRevokeKey = async (id: number) => {
    if (!confirm("Are you sure you want to revoke and delete this API key? This action cannot be undone.")) {
      return;
    }

    const res = await apiRequest(`/api/apikeys/${id}/`, {
      method: "DELETE",
    });

    if (res.success) {
      setApiKeys((prev) => prev.filter((k) => k.id !== id));
    }
  };

  const handleCopySecret = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyCurl = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  if (authLoading || (!stats && loading)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  const sampleKey = newlyGeneratedSecret || (apiKeys.length > 0 ? `${apiKeys[0].prefix}...` : "jrv_live_YOUR_KEY_HERE");
  const curlExample = `curl -X GET "http://localhost:8000/api/dashboard/stats/" \\\n  -H "X-API-Key: ${sampleKey}"`;

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
          onClick={() => {
            fetchStats();
            fetchApiKeys();
          }}
          disabled={loading || keysLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading || keysLoading ? "animate-spin" : ""}`} />
          <span>Sync Workspace</span>
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
          title="Active API Keys"
          value={apiKeys.length}
          change="Tenant Scoped"
          changePositive={true}
          icon={Key}
          iconColor="text-amber-400"
        />
      </div>

      {/* API Key Newly Created Modal / Alert */}
      {newlyGeneratedSecret && (
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-500/30">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white">Save Your API Key</h3>
              <p className="text-xs text-amber-200/80 mt-1">
                Please copy this secret key now. For your security, this key will not be displayed again.
              </p>
              <div className="mt-3 flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-slate-950 font-mono text-sm text-cyan-300 border border-amber-500/30 truncate">
                  {newlyGeneratedSecret}
                </code>
                <button
                  onClick={() => handleCopySecret(newlyGeneratedSecret)}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
                >
                  {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? "Copied!" : "Copy Secret"}</span>
                </button>
                <button
                  onClick={() => setNewlyGeneratedSecret(null)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Management Section */}
      <div className="mt-10 glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">API Keys & Machine Credentials</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Authenticate automated services, CLI tools, and microservices using SHA-256 hashed API keys.
            </p>
          </div>

          {/* Create Key Form */}
          <form onSubmit={handleCreateKey} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="e.g. CLI Production"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={generatingKey || !newKeyName.trim()}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{generatingKey ? "Generating..." : "Generate Key"}</span>
            </button>
          </form>
        </div>

        {keyError && (
          <p className="text-xs text-red-400 mt-3">{keyError}</p>
        )}

        {/* Keys List */}
        <div className="mt-6 space-y-3">
          {keysLoading ? (
            <div className="py-6 text-center text-xs text-slate-500">Loading API keys...</div>
          ) : apiKeys.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
              No API keys generated yet. Create one above to interact with the API programmatically.
            </div>
          ) : (
            apiKeys.map((k) => (
              <div
                key={k.id}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">{k.name}</span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        {k.prefix}...
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          k.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {k.is_active ? "Active" : "Revoked"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Created: {new Date(k.created_at).toLocaleDateString()} •{" "}
                      {k.last_used_at
                        ? `Last used: ${new Date(k.last_used_at).toLocaleDateString()}`
                        : "Never used"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRevokeKey(k.id)}
                  title="Revoke and delete API Key"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* cURL Usage Code Block */}
        <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Example Usage via cURL</span>
            </div>
            <button
              onClick={() => handleCopyCurl(curlExample)}
              className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1"
            >
              {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCurl ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 bg-slate-900/80 rounded-lg">
            {curlExample}
          </pre>
        </div>
      </div>

      {/* System Services & Actions Grid */}
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
                  <p className="text-xs text-slate-400">JWT Authentication, API Key validation, RBAC filters</p>
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
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Security & Authorization</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Tenant Isolation: Strict
              </p>
              <span className="inline-block mt-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Encryption: SHA-256 + Argon2
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
