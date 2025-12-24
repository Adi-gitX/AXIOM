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
    <div className="h-screen sticky top-0 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col w-64 shrink-0 z-40 transition-all duration-300">

      {/* Brand */}
      <div className="h-20 flex items-center px-6 border-b border-white/5">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
            <span className="text-white text-sm font-bold font-display">A</span>
          </div>
          <span className="font-semibold text-lg text-white tracking-wide font-display group-hover:text-glow transition-all">AXIOM</span>
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
                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }
            `}
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Glow */}
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50 blur-sm" />}

                <span className={`w-5 text-xs text-center font-mono opacity-40 group-hover:opacity-80 transition-opacity ${isActive ? 'text-white' : ''}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative z-10 font-sans tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-300 group border border-transparent hover:border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-gray-400 text-xs font-medium group-hover:text-white group-hover:border-white/30 transition-all">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 group-hover:text-white truncate transition-colors">Aditya K.</p>
            <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
