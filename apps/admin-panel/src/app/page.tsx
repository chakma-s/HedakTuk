"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Users, Store, IndianRupee, Activity, AlertCircle } from "lucide-react";
import { fetchAPI } from "@/lib/api";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalRestaurants: 0,
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchAPI('/orders/admin/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Platform Overview</h1>
        <p className="text-muted mt-1">Monitor global HedakTuk metrics and system health.</p>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Platform Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} trend="Real-time" isUp={true} icon={<IndianRupee />} />
        <StatCard title="Active Restaurants" value={stats.totalRestaurants.toString()} trend="Platform total" isUp={true} icon={<Store />} />
        <StatCard title="Registered Users" value={stats.totalUsers.toString()} trend="Platform total" isUp={true} icon={<Users />} />
        <StatCard title="Total Orders" value={stats.totalOrders.toString()} trend="Real-time" isUp={true} icon={<Activity />} highlight={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Revenue Growth</h2>
            <select className="bg-background border border-border rounded-md px-3 py-1 text-sm text-foreground">
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 bg-surface-alt rounded-lg border border-border border-dashed flex items-center justify-center text-muted min-h-[300px]">
            [ Growth Chart Visualization ]
          </div>
        </div>

        {/* System Alerts / Pending Actions */}
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <AlertCircle className="text-primary" size={20} />
            Pending Actions
          </h2>
          
          <div className="space-y-4">
            <ActionItem title="New Restaurant Approval" desc="Spicy Corner applied for partnership" time="10 mins ago" />
            <ActionItem title="High Delivery Delay" desc="Zone B is experiencing 45m+ wait times" time="1 hour ago" isWarning />
            <ActionItem title="Payouts Pending" desc="14 restaurants waiting for weekly settlement" time="2 hours ago" />
            <ActionItem title="Partner Application" desc="Raj Kumar submitted rider documents" time="3 hours ago" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isUp, icon, highlight = false }: { title: string, value: string, trend: string, isUp: boolean, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`bg-surface border ${highlight ? 'border-primary shadow-md shadow-primary/10' : 'border-border'} rounded-xl p-6 relative overflow-hidden`}>
      {highlight && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full" />}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-muted font-bold text-xs uppercase tracking-wider">{title}</h3>
        <div className={`p-2 rounded-lg ${highlight ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <p className="text-3xl font-black text-foreground mb-1">{value}</p>
        <span className={`text-sm font-bold flex items-center gap-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function ActionItem({ title, desc, time, isWarning = false }: { title: string, desc: string, time: string, isWarning?: boolean }) {
  return (
    <div className={`flex flex-col p-4 rounded-lg border ${isWarning ? 'bg-red-500/5 border-red-500/20' : 'bg-background border-border'}`}>
      <div className="flex justify-between items-start mb-1">
        <h4 className={`font-bold text-sm ${isWarning ? 'text-red-500 dark:text-red-400' : 'text-foreground'}`}>{title}</h4>
        <span className="text-xs text-muted font-medium">{time}</span>
      </div>
      <p className="text-xs text-muted">{desc}</p>
    </div>
  );
}
