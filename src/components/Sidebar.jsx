import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Youtube,
  Code2,
  BookOpen,
  MessageSquare,
  Briefcase,
  Settings,
  LayoutDashboard,
  Sparkles,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/app/education', icon: Youtube, label: 'Education' },
    { path: '/app/dsa', icon: Code2, label: 'DSA Tracker' },
    { path: '/app/interview', icon: BookOpen, label: 'Interview Prep' },
    { path: '/app/connect', icon: MessageSquare, label: 'Dev Connect' },
    { path: '/app/jobs', icon: Briefcase, label: 'Internships' },
    { path: '/app/posts', icon: FileText, label: 'Posts' },
  ];

  return (
    <div className="h-screen sticky top-0 bg-white border-r border-gray-100 text-gray-900 flex flex-col z-50 w-60 shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Sparkles size={14} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight font-display">AXIOM</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium
              ${isActive
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <item.icon size={18} strokeWidth={1.75} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        {/* Settings Link */}
        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors mb-3">
          <Settings size={18} strokeWidth={1.75} />
          <span>Settings</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">Aditya K.</p>
            <p className="text-xs text-gray-400 truncate">Pro Member</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
