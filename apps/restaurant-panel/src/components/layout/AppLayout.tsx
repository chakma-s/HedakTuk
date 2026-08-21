"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  BarChart3, 
  Settings, 
  Moon, 
  Sun,
  LogOut
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Live Orders", href: "/", icon: LayoutDashboard },
  { name: "Menu Editor", href: "/menu", icon: UtensilsCrossed },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Hedaktuk</h1>
          <p className="text-xs text-muted mt-1">Restaurant Panel</p>
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
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-foreground hover:bg-surface-alt"
                }`}
              >
                <Icon size={20} className={isActive ? "text-primary" : "text-muted"} />
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
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (simplified for now) */}
        <header className="md:hidden h-16 border-b border-border bg-surface flex items-center justify-between px-4">
          <h1 className="text-xl font-black text-primary uppercase tracking-tight">Hedaktuk</h1>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
