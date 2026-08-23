"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, MoreVertical, Filter, Loader2, Store, AlertTriangle } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface RestaurantItem {
  id: string;
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  cuisines: string[];
  isActive: boolean;
  isOpen: boolean;
  owner?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  _count?: {
    orders: number;
    menuItems: number;
  };
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI('/restaurants/admin/all');
      if (res && res.data) {
        setRestaurants(res.data);
      }
    } catch (err) {
      console.error("Failed to load admin restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (restaurant: RestaurantItem) => {
    const newStatus = !restaurant.isActive;
    setActionLoadingId(restaurant.id);
    try {
      await fetchAPI(`/restaurants/${restaurant.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: newStatus }),
      });
      setRestaurants((prev) =>
        prev.map((r) => (r.id === restaurant.id ? { ...r, isActive: newStatus } : r))
      );
    } catch (err: any) {
      console.error("Failed to update status:", err);
      alert(err.message || "Failed to update restaurant status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      (r.owner?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && r.isActive) ||
      (statusFilter === "suspended" && !r.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Restaurant Management</h1>
          <p className="text-muted text-sm mt-1">Approve, monitor, and manage partner restaurants.</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              type="text"
              placeholder="Search restaurants or owners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:border-primary text-foreground"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">All Statuses ({restaurants.length})</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
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
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Restaurant</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Owner</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Dishes</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Orders</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Rating</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-foreground">{restaurant.name}</p>
                        <p className="text-xs text-muted max-w-xs truncate">{restaurant.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{restaurant.owner?.name || "Unassigned"}</p>
                      <p className="text-xs text-muted">{restaurant.owner?.phone || "No phone"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge isActive={restaurant.isActive} />
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {restaurant._count?.menuItems || 0} items
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {restaurant._count?.orders || 0} orders
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 font-bold">
                        <span>{restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "New"}</span>
                        {restaurant.rating > 0 && <span className="text-yellow-500 text-xs">★</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(restaurant)}
                        disabled={actionLoadingId === restaurant.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          restaurant.isActive
                            ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                            : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        }`}
                      >
                        {actionLoadingId === restaurant.id ? (
                          <Loader2 size={14} className="animate-spin inline" />
                        ) : restaurant.isActive ? (
                          "Suspend"
                        ) : (
                          "Activate"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRestaurants.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted">
                      <Store className="mx-auto w-10 h-10 mb-2 opacity-30" />
                      <p className="font-medium">No restaurants found matching your filter.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-600 border border-green-500/20">
        Active
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-500/20">
      Suspended
    </span>
  );
}
