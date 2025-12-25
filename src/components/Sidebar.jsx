import React from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatedThemeToggler } from './AnimatedThemeToggler';

const Sidebar = () => {
  const navItems = [
    { path: '/app', label: 'Dashboard', end: true },
    { path: '/app/education', label: 'Education' },
    { path: '/app/dsa', label: 'DSA Tracker' },
    { path: '/app/interview', label: 'Interview Prep' },
    { path: '/app/connect', label: 'Dev Connect' },
    { path: '/app/jobs', label: 'Jobs' },
    { path: '/app/posts', label: 'Posts' },
  ];

  return (
    <div className="h-screen sticky top-0 border-r border-border bg-background/60 backdrop-blur-xl flex flex-col w-64 shrink-0 z-40 transition-all duration-300">

      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-border">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300">
            <span className="text-primary text-sm font-bold font-display">A</span>
          </div>
          <span className="font-semibold text-lg text-foreground tracking-wide font-display group-hover:text-glow transition-all">AXIOM</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden
              ${isActive
                ? 'bg-primary/10 text-primary shadow-sm border border-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Glow */}
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50 blur-sm" />}

                <span className={`w-5 text-xs text-center font-mono opacity-40 group-hover:opacity-80 transition-opacity ${isActive ? 'text-primary' : ''}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative z-10 font-sans tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border flex items-center gap-2">
        <div className="flex-1 flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted/50 cursor-pointer transition-all duration-300 group border border-transparent hover:border-border/50">
          <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground text-xs font-medium group-hover:text-foreground group-hover:border-border transition-all">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground group-hover:text-primary truncate transition-colors">Aditya K.</p>
            <p className="text-[10px] text-muted-foreground group-hover:text-foreground/80 transition-colors">Pro Plan</p>
          </div>
        </div>
        <AnimatedThemeToggler />
      </div>
    </div>
  );
};

export default Sidebar;
