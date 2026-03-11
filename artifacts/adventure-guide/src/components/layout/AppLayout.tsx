import React from 'react';
import { Link, useLocation } from 'wouter';
import { Sword, Skull, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: Sword, label: 'Hero Forge' },
    { href: '/tavern', icon: Skull, label: 'NPC Tavern' },
    { href: '/roster', icon: Library, label: 'Roster' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-40">
        <img 
          src={`${import.meta.env.BASE_URL}images/parchment-bg.png`} 
          className="w-full h-full object-cover" 
          alt="" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/90" />
      </div>

      <div className="w-full max-w-[480px] flex flex-col min-h-screen relative shadow-2xl shadow-black/50 bg-background/60 backdrop-blur-sm border-x border-primary/10">
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-primary/20 px-6 py-4 flex items-center justify-center text-center rounded-b-2xl">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-primary tracking-widest uppercase text-glow">
            Adventure Guide
          </h1>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex flex-col pb-24 relative overflow-hidden">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-[480px] z-50 glass-panel border-t border-primary/20 rounded-t-2xl pb-safe">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className="flex flex-col items-center justify-center w-24 py-2 cursor-pointer group hover-elevate rounded-xl">
                    <div className="relative">
                      <item.icon 
                        className={cn(
                          "w-6 h-6 mb-1 transition-colors duration-300", 
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary/70"
                        )} 
                      />
                      {isActive && (
                        <motion.div 
                          layoutId="nav-indicator"
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] font-semibold tracking-wider uppercase transition-colors duration-300",
                      isActive ? "text-primary text-glow" : "text-muted-foreground"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
