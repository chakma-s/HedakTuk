"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  Settings, 
  Moon, 
  Sun,
  LogOut,
  Bell,
  Search
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Restaurants", href: "/restaurants", icon: Store },
  { name: "Users", href: "/users", icon: Users },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Hedaktuk</h1>
          <p className="text-xs text-muted mt-1 font-bold uppercase tracking-widest">Super Admin</p>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                  isActive 
                    ? "bg-primary text-white font-semibold shadow-md" 
                    : "text-foreground hover:bg-surface-alt"
                }`}
              >
                <Icon size={20} className={isActive ? "text-white" : "text-muted"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <button 
            className="flex w-full items-center gap-3 px-3 py-3 rounded-md text-foreground hover:bg-surface-alt transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={20} className="text-muted" /> : <Moon size={20} className="text-muted" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button className="flex w-full items-center gap-3 px-3 py-3 rounded-md text-foreground hover:bg-surface-alt transition-colors">
            <Settings size={20} className="text-muted" />
            <span>Settings</span>
          </button>
          
          <button className="flex w-full items-center gap-3 px-3 py-3 rounded-md text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search restaurants, users, or orders..." 
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>

        {/* Mobile Header (simplified) */}
        <header className="md:hidden h-14 border-b border-border bg-surface flex items-center justify-between px-4">
          <h1 className="text-lg font-black text-primary uppercase tracking-tight">HT Admin</h1>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
