"use client";

import React from "react";
import { TrendingUp, Users, ShoppingBag, IndianRupee } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics Overview</h1>
        <p className="text-muted">Track your restaurant's performance and earnings.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value="₹45,231" trend="+12.5%" isUp={true} icon={<IndianRupee />} />
        <StatCard title="Total Orders" value="142" trend="+8.2%" isUp={true} icon={<ShoppingBag />} />
        <StatCard title="New Customers" value="28" trend="-2.4%" isUp={false} icon={<Users />} />
        <StatCard title="Avg Order Value" value="₹318" trend="+4.1%" isUp={true} icon={<TrendingUp />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Placeholder Chart */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-foreground mb-4">Revenue over Time</h2>
          <div className="flex-1 bg-surface-alt rounded-lg border border-border border-dashed flex items-center justify-center text-muted">
            [ Chart Visualization Placeholder ]
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-foreground mb-4">Top Selling Items</h2>
          <div className="space-y-4">
            <TopItem name="Chicken Biryani" sales="48 orders" revenue="₹15,360" index={1} />
            <TopItem name="Paneer Butter Masala" sales="32 orders" revenue="₹8,960" index={2} />
            <TopItem name="Garlic Naan" sales="124 orders" revenue="₹7,440" index={3} />
            <TopItem name="Masala Dosa" sales="28 orders" revenue="₹3,360" index={4} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isUp, icon }: { title: string, value: string, trend: string, isUp: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-muted font-bold text-sm uppercase tracking-wider">{title}</h3>
        <div className="p-2 bg-primary/10 text-primary rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-black text-foreground">{value}</p>
        <span className={`text-sm font-bold flex items-center gap-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function TopItem({ name, sales, revenue, index }: { name: string, sales: string, revenue: string, index: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-muted font-bold w-4">{index}</span>
        <div>
          <p className="font-bold text-foreground text-sm">{name}</p>
          <p className="text-xs text-muted">{sales}</p>
        </div>
      </div>
      <p className="font-bold text-primary">{revenue}</p>
    </div>
  );
}
