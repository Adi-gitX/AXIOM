import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Youtube,
  Code2,
  BookOpen,
  MessageSquare,
  Briefcase,
  ChevronRight,
  Settings,
  Plus,
  Sparkles,
  Moon
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/app/education', icon: Youtube, label: 'Education' },
    { path: '/app/dsa', icon: Code2, label: 'DSA Tracker' },
    { path: '/app/interview', icon: BookOpen, label: 'Interview Prep' },
    { path: '/app/connect', icon: MessageSquare, label: 'Dev Connect' },
    { path: '/app/jobs', icon: Briefcase, label: 'Internships' },
  ];

  return (
    <div className="h-screen sticky top-0 bg-[#0a0a0a] text-white flex flex-col z-50 w-56 shrink-0">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-5">
        <NavLink to="/app" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
            <Sparkles size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight">AXIOM</span>
        </NavLink>
      </div>

      {/* Main Action CTA */}
      <div className="px-4 mb-6">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all text-sm">
          <Plus size={16} strokeWidth={2.5} />
          <span>New Study</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-6 overflow-y-auto">

        {/* Section 1 */}
        <div className="space-y-0.5">
          <p className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
            Discovery
          </p>
          {navItems.slice(0, 3).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-sm
                ${isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'}
                `}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Section 2 */}
        <div className="space-y-0.5">
          <p className="px-2 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
            Community
          </p>
          {navItems.slice(3).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-sm
                ${isActive
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'}
                `}
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

      </nav>

      {/* Footer */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <button className="flex items-center gap-2 px-2.5 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors ml-auto">
            <Moon size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2.5 px-2.5 py-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Aditya K.</p>
            <p className="text-xs text-white/40 truncate">Pro Member</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
