import React from 'react';
import { NavLink } from 'react-router-dom';

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
    <div className="h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col w-56 shrink-0">

      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">AXIOM</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-1">
        {navItems.map((item, i) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
              ${isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <span className="w-5 text-xs text-center opacity-50">{String(i + 1).padStart(2, '0')}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">Aditya K.</p>
            <p className="text-xs text-gray-400">Pro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
