"use client";

import React, { useState } from "react";
import { Search, Filter, Mail, Phone, MoreHorizontal, ShieldAlert } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "rider" | "admin";
  status: "active" | "banned";
  joinDate: string;
}

const MOCK_USERS: User[] = [
  { id: "U0821", name: "Rahul Sharma", email: "rahul.s@example.com", phone: "+91 9876543210", role: "customer", status: "active", joinDate: "Oct 12, 2025" },
  { id: "U0822", name: "Priya Singh", email: "priya.singh@example.com", phone: "+91 9876543211", role: "customer", status: "active", joinDate: "Oct 15, 2025" },
  { id: "U0823", name: "Amit Delivery", email: "amit.rider@example.com", phone: "+91 9876543212", role: "rider", status: "active", joinDate: "Nov 02, 2025" },
  { id: "U0824", name: "Scam User", email: "fake.user123@example.com", phone: "+91 9000000000", role: "customer", status: "banned", joinDate: "Nov 10, 2025" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Directory</h1>
          <p className="text-muted text-sm mt-1">Manage customers, delivery partners, and admins.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:bg-surface-alt transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl flex flex-col flex-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-alt border-b border-border text-muted">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">User Details</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Contact</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Join Date</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted font-mono">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="flex items-center gap-2 text-muted"><Mail size={12} /> {user.email}</span>
                      <span className="flex items-center gap-2 text-muted"><Phone size={12} /> {user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="text-green-500 font-medium">Active</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-md w-fit">
                        <ShieldAlert size={14} /> Banned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted">{user.joinDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-muted hover:text-foreground transition-colors rounded-lg hover:bg-surface-alt">
                      <MoreHorizontal size={18} />
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

function RoleBadge({ role }: { role: string }) {
  const styles = {
    customer: "bg-blue-500/10 text-blue-600 border border-blue-500/20",
    rider: "bg-orange-500/10 text-orange-600 border border-orange-500/20",
    admin: "bg-purple-500/10 text-purple-600 border border-purple-500/20"
  }[role] || "bg-gray-500/10 text-gray-500";

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles}`}>
      {role}
    </span>
  );
}
