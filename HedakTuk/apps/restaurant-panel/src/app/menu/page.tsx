"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Loader2 } from "lucide-react";
import { fetchAPI } from "@/lib/api";

interface MenuItem {
  id: string;
  name: string;
  category: { id: string; name: string };
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
}

export default function MenuEditorPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    setLoading(true);
    try {
      // 1. Get my restaurant
      const myRestaurants = await fetchAPI('/restaurants');
      const myRestaurant = myRestaurants.data[0];
      if (!myRestaurant) {
          setLoading(false);
          return;
      }

      // 2. Get menu items for my restaurant
      const res = await fetchAPI(`/restaurants/${myRestaurant.id}/menu/items`);
      if (res && res.data) {
          setItems(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(
    (item) => item.name.toLowerCase().includes(search.toLowerCase()) || 
              (item.category?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Menu Editor</h1>
          <p className="text-muted">Manage your restaurant's dishes and categories.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <Plus size={18} />
          Add New Dish
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl flex flex-col flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border bg-surface-alt flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search dishes or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary">
              <option>All Categories</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-alt sticky top-0 border-b border-border text-muted">
                <tr>
                  <th className="px-6 py-4 font-bold">Dish Name</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-sm flex items-center justify-center border ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                        </div>
                        <span className="font-bold text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted">{item.category?.name || 'Uncategorized'}</td>
                    <td className="px-6 py-4 font-bold text-foreground">₹{item.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.isAvailable 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      }`}>
                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-muted hover:text-primary transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted">
                      No dishes found matching your search.
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
