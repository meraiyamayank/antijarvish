"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { StatCard } from "@/components/StatCard";
import {
  Users,
  ShieldAlert,
  DollarSign,
  Cpu,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    const [statsRes, usersRes] = await Promise.all([
      apiRequest("/api/dashboard/stats/"),
      apiRequest("/api/dashboard/admin/users/"),
    ]);

    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data);
    }

    if (usersRes.success && usersRes.data) {
      setUserList(usersRes.data.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (user.role !== "ADMIN") {
        router.push("/dashboard");
        return;
      }
      fetchAdminData();
    }
  }, [user, authLoading, router]);

  const toggleRole = async (targetUser: any) => {
    const newRole = targetUser.role === "ADMIN" ? "MEMBER" : "ADMIN";
    const res = await apiRequest(`/api/dashboard/admin/users/${targetUser.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });

    if (res.success) {
      setActionMessage(`Updated role of ${targetUser.email} to ${newRole}`);
      fetchAdminData();
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const filteredUsers = userList.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || (loading && !stats)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
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
              Administrative Control Console
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
              Superuser RBAC
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Global governance, user role assignment, and system-level telemetry.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionMessage && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          {actionMessage}
        </div>
      )}

      {/* Admin Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <StatCard
          title="Total Registered Users"
          value={stats?.total_users || 0}
          change={`+${stats?.new_users_30d || 0} (30d)`}
          changePositive={true}
          icon={Users}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Admin Accounts"
          value={stats?.admin_accounts || 1}
          change="Privileged"
          changePositive={true}
          icon={ShieldAlert}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Monthly Revenue (MRR)"
          value={`$${(stats?.monthly_recurring_revenue || 0).toLocaleString()}`}
          change="+18.4%"
          changePositive={true}
          icon={DollarSign}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Infrastructure Uptime"
          value={stats?.uptime || "99.98%"}
          change="Operational"
          changePositive={true}
          icon={Cpu}
          iconColor="text-purple-400"
        />
      </div>

      {/* User Management Registry */}
      <div className="mt-10 glass-panel rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">User Registry & Role Management</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click &quot;Toggle Role&quot; to change RBAC permissions between Administrator and Member.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-white">{u.email}</div>
                    <div className="text-xs text-slate-500">
                      {u.first_name || u.last_name
                        ? `${u.first_name} ${u.last_name}`
                        : "No profile name"}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        u.role === "ADMIN"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">
                    {new Date(u.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => toggleRole(u)}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      Promote / Demote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
