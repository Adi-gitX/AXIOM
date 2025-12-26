import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatedThemeToggler } from './AnimatedThemeToggler';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../stores/useUserStore';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const { user: profileData, fetchProfile } = useUserStore();

  useEffect(() => {
    if (currentUser?.email) {
      fetchProfile(currentUser.email);
    }
  }, [currentUser, fetchProfile]);

  const displayName = profileData?.name || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const displayAvatar = profileData?.avatar || currentUser?.photoURL || "https://github.com/shadcn.png";

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
    <div className="h-screen sticky top-0 flex flex-col w-72 shrink-0 z-40 p-4 transition-all duration-300">
      <div className="h-full flex flex-col rounded-[2rem] bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden transition-all duration-500">
        <div className="h-24 flex items-center px-6">
          <NavLink to="/" className="flex items-center gap-4 group w-full py-2">
            <div className="w-10 h-10 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-foreground text-sm font-bold font-display">A</span>
            </div>
            <span className="font-bold text-xl text-foreground font-display tracking-tight group-hover:text-glow transition-all">AXIOM</span>
          </NavLink>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar px-4 pb-4">
          {navItems.map((item, i) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                                relative flex items-center gap-4 px-5 py-3.5 rounded-full text-sm font-medium transition-all duration-300 group
                                ${isActive
                  ? 'bg-foreground text-background shadow-lg shadow-foreground/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                }
                            `}
            >
              {({ isActive }) => (
                <>
                  <span className={`w-5 text-xs text-center font-mono transition-opacity ${isActive ? 'opacity-60' : 'opacity-40 group-hover:opacity-100'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-sans tracking-wide font-semibold">{item.label}</span>
                  {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-background animate-pulse" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-white/10 dark:border-white/5 bg-background/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <NavLink to="/app/profile" className="flex-1 flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-foreground/5 transition-all duration-300 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center text-foreground text-xs font-bold relative overflow-hidden">
                <img src={displayAvatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground group-hover:text-glow transition-colors truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Pro Plan</p>
              </div>
            </NavLink>
            <div className="scale-90 origin-right flex flex-col items-center gap-2">
              <NavLink to="/app/settings" className="p-2 rounded-full hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
              </NavLink>
              <AnimatedThemeToggler />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
