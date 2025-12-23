import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Youtube,
  Code2,
  BookOpen,
  MessageSquare,
  Briefcase,
  Settings,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { path: '/', icon: Youtube, label: 'Education Hub', color: 'text-red-500' },
    { path: '/dsa', icon: Code2, label: 'DSA Tracker', color: 'text-green-500' },
    { path: '/interview', icon: BookOpen, label: 'Interview Prep', color: 'text-yellow-500' },
    { path: '/connect', icon: MessageSquare, label: 'Dev Connect', color: 'text-blue-500' },
    { path: '/jobs', icon: Briefcase, label: 'Internships', color: 'text-purple-500' },
  ];

  return (
    <motion.div
      className="h-screen bg-surface border-r border-border flex flex-col z-50 transition-all duration-300 ease-in-out"
      animate={{ width: isExpanded ? 240 : 80 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center border-b border-border/50">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap px-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
            <Code2 size={24} />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display text-xl font-bold tracking-wider"
              >
                AXIOM
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center h-12 rounded-xl transition-all duration-200 group overflow-hidden
              ${isActive ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-surfaceHighlight hover:text-text'}
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
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 overflow-hidden rounded-xl p-2 hover:bg-surfaceHighlight transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
            U
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-medium text-sm text-text">User Name</p>
                <p className="text-xs text-textMuted">Pro Member</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
