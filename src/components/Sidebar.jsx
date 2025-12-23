import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Youtube,
  Code2,
  BookOpen,
  MessageSquare,
  Briefcase,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Updated paths to match /app routing
  const navItems = [
    { path: '/app/education', icon: Youtube, label: 'Education Hub', color: 'text-red-500' },
    { path: '/app/dsa', icon: Code2, label: 'DSA Tracker', color: 'text-green-500' },
    { path: '/app/interview', icon: BookOpen, label: 'Interview Prep', color: 'text-yellow-500' },
    { path: '/app/connect', icon: MessageSquare, label: 'Dev Connect', color: 'text-blue-500' },
    { path: '/app/jobs', icon: Briefcase, label: 'Internships', color: 'text-purple-500' },
  ];

  return (
    <motion.div
      className="h-screen sticky top-0 bg-transparent backdrop-blur-md border-r border-white/10 flex flex-col z-50 transition-all duration-300 ease-in-out"
      animate={{ width: isExpanded ? 240 : 80 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-white/10">
        <NavLink to="/app" className="flex items-center gap-3 overflow-hidden whitespace-nowrap px-4 cursor-pointer">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-500 shadow-lg shadow-blue-500/20">
            <Code2 size={24} />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display text-xl font-bold tracking-wider text-white"
              >
                AXIOM
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center h-12 rounded-xl transition-all duration-300 group overflow-hidden
              ${isActive ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm' : 'text-textMuted hover:bg-white/5 hover:text-white'}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="w-14 flex justify-center items-center flex-shrink-0">
                  <item.icon size={24} className={isActive ? item.color : ''} />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="whitespace-nowrap font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 overflow-hidden rounded-xl p-2 hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
            D
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-medium text-sm text-white">Dev User</p>
                <p className="text-xs text-textMuted">Pro Plan</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
