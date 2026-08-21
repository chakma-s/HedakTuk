"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, XCircle, MoreVertical, Filter } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  status: "active" | "pending" | "suspended";
  revenue: string;
  rating: number;
}

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: "R001", name: "Spicy Corner", owner: "Raj Kumar", status: "pending", revenue: "₹0", rating: 0 },
  { id: "R002", name: "Burger King", owner: "BK India", status: "active", revenue: "₹450,200", rating: 4.2 },
  { id: "R003", name: "Udupi Grand", owner: "Suresh Rao", status: "active", revenue: "₹820,500", rating: 4.8 },
  { id: "R004", name: "Pizza Hut", owner: "Yum Brands", status: "suspended", revenue: "₹120,000", rating: 3.5 },
];

export default function RestaurantsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Restaurant Management</h1>
          <p className="text-muted text-sm mt-1">Approve, monitor, and manage restaurant partners.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search restaurants..."
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
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">ID</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Restaurant Name</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Owner</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Total Revenue</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Rating</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_RESTAURANTS.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-surface-alt/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-muted">{restaurant.id}</td>
                  <td className="px-6 py-4 font-bold text-foreground">{restaurant.name}</td>
                  <td className="px-6 py-4 text-muted">{restaurant.owner}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={restaurant.status} />
                  </td>
                  <td className="px-6 py-4 font-medium">{restaurant.revenue}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{restaurant.rating > 0 ? restaurant.rating : '-'}</span>
                      {restaurant.rating > 0 && <span className="text-yellow-500 text-xs">★</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {restaurant.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 bg-green-500/10 text-green-600 rounded hover:bg-green-500/20 transition-colors" title="Approve">
                          <CheckCircle2 size={18} />
                        </button>
                        <button className="p-1.5 bg-red-500/10 text-red-600 rounded hover:bg-red-500/20 transition-colors" title="Reject">
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                    {restaurant.status !== 'pending' && (
                      <button className="p-1.5 text-muted hover:text-foreground transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    )}
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

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: "bg-green-500/10 text-green-600 border border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
    suspended: "bg-red-500/10 text-red-600 border border-red-500/20"
  }[status] || "bg-gray-500/10 text-gray-500";

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles}`}>
      {status}
    </span>
  );
}
