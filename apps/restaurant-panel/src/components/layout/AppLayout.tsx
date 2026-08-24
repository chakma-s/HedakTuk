"use client";

import React, { useState } from "react";
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
  LogOut,
  Menu,
  X
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Live Orders", href: "/", icon: LayoutDashboard },
  { name: "Menu Editor", href: "/menu", icon: UtensilsCrossed },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = () => (
    <nav className="flex-1 py-4 px-3 space-y-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.name} 
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-3 rounded-md transition-all active:scale-95 ${
              isActive 
                ? "bg-primary/10 text-primary font-semibold" 
                : "text-foreground hover:bg-surface-alt active:opacity-80"
            }`}
          >
            <Icon size={20} className={isActive ? "text-primary" : "text-muted"} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border bg-surface flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Hedaktuk</h1>
          <p className="text-xs text-muted mt-1">Restaurant Panel</p>
        </div>
        
        <NavLinks />

        <div className="p-4 border-t border-border space-y-2">
          <button 
            className="flex w-full items-center gap-3 px-3 py-3 rounded-md text-foreground hover:bg-surface-alt transition-all active:scale-95 active:opacity-80"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={20} className="text-muted" /> : <Moon size={20} className="text-muted" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button className="flex w-full items-center gap-3 px-3 py-3 rounded-md text-foreground hover:bg-surface-alt transition-all active:scale-95 active:opacity-80">
            <Settings size={20} className="text-muted" />
            <span>Settings</span>
          </button>
          
          <button className="flex w-full items-center gap-3 px-3 py-3 rounded-md text-red-500 hover:bg-red-500/10 transition-all active:scale-95 active:opacity-80">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="w-64 bg-surface h-full flex flex-col z-50 shadow-xl border-r border-border">
            <div className="p-4 flex items-center justify-between border-b border-border">
              <div>
                <h1 className="text-2xl font-black text-primary uppercase tracking-tight">Hedaktuk</h1>
                <p className="text-xs text-muted mt-1">Restaurant Panel</p>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-muted hover:text-foreground active:scale-95"
              >
                <X size={24} />
              </button>
            </div>
            <NavLinks />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 border-b border-border bg-surface items-center justify-end px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2 text-muted hover:text-primary transition-all active:scale-95"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-bold cursor-pointer active:scale-95 transition-transform">
              R
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border bg-surface flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-foreground active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black text-primary uppercase tracking-tight">Hedaktuk</h1>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 active:scale-95 transition-transform">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
