"use client";

import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, ShieldAlert, Loader2, Users, Shield, Check, X } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface UserItem {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: "CUSTOMER" | "RESTAURANT_OWNER" | "DELIVERY_PARTNER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  _count?: { orders: number };
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Edit Role Modal
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI('/users');
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserItem) => {
    const updatedStatus = !user.isActive;
    setActionLoadingId(user.id);
    try {
      await fetchAPI(`/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: updatedStatus } : u))
      );
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert(err.message || "Failed to update user status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveRole = async () => {
    if (!editingUser || !selectedRole) return;
    setActionLoadingId(editingUser.id);
    try {
      await fetchAPI(`/users/${editingUser.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: selectedRole }),
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, role: selectedRole as any } : u))
      );
      setEditingUser(null);
    } catch (err: any) {
      console.error("Failed to update role:", err);
      alert(err.message || "Failed to update role");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Directory</h1>
          <p className="text-muted text-sm mt-1">Manage customers, restaurant owners, riders, and platform admins.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="CUSTOMER">Customers</option>
            <option value="RESTAURANT_OWNER">Restaurant Owners</option>
            <option value="DELIVERY_PARTNER">Delivery Riders</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-surface-alt border-b border-border text-muted">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">User Details</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Contact</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Orders</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Registered</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold uppercase">
                          {user.name ? user.name.charAt(0) : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{user.name || "Unnamed User"}</p>
                          <p className="text-xs text-muted font-mono">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-2 text-muted">
                          <Phone size={12} /> {user.phone}
                        </span>
                        {user.email && (
                          <span className="flex items-center gap-2 text-muted">
                            <Mail size={12} /> {user.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {user._count?.orders || 0} orders
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="text-green-500 font-bold text-xs bg-green-500/10 px-2 py-1 rounded-md">
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md text-xs w-fit">
                          <ShieldAlert size={14} /> Deactivated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setSelectedRole(user.role);
                          }}
                          className="px-2.5 py-1 text-xs font-bold border border-border rounded-lg text-foreground hover:bg-surface-alt transition-colors"
                        >
                          Role
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoadingId === user.id}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                            user.isActive
                              ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                              : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted">
                      <Users className="mx-auto w-10 h-10 mb-2 opacity-30" />
                      <p className="font-medium">No users found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Role Editor Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-foreground">Change User Role</h3>
              <button onClick={() => setEditingUser(null)} className="text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-muted mb-4">
              Update role for <strong className="text-foreground">{editingUser.name || editingUser.phone}</strong>
            </p>
            <div className="space-y-2 mb-6">
              {[
                { value: "CUSTOMER", label: "Customer" },
                { value: "RESTAURANT_OWNER", label: "Restaurant Owner" },
                { value: "DELIVERY_PARTNER", label: "Delivery Partner" },
                { value: "ADMIN", label: "Super Admin" },
              ].map((roleOpt) => (
                <button
                  key={roleOpt.value}
                  type="button"
                  onClick={() => setSelectedRole(roleOpt.value)}
                  className={`w-full py-2.5 px-3 rounded-lg text-sm font-bold flex items-center justify-between border transition-colors ${
                    selectedRole === roleOpt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:bg-surface-alt"
                  }`}
                >
                  {roleOpt.label}
                  {selectedRole === roleOpt.value && <Check size={16} />}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-surface hover:bg-surface-alt border border-border rounded-lg text-sm font-bold text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                disabled={actionLoadingId === editingUser.id}
                className="px-4 py-2 bg-primary hover:bg-orange-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"
              >
                {actionLoadingId === editingUser.id && <Loader2 size={14} className="animate-spin" />}
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    CUSTOMER: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    DELIVERY_PARTNER: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    RESTAURANT_OWNER: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    ADMIN: "bg-purple-500/10 text-purple-600 border border-purple-500/20",
  };

  const labels: Record<string, string> = {
    CUSTOMER: "Customer",
    DELIVERY_PARTNER: "Rider",
    RESTAURANT_OWNER: "Restaurant Owner",
    ADMIN: "Admin",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
        styles[role] || "bg-gray-500/10 text-gray-500"
      }`}
    >
      {labels[role] || role}
    </span>
  );
}
