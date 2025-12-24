import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const PublicNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to check if link is active
    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 bg-black/50 backdrop-blur-2xl border-b border-white/5 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold tracking-tight text-white font-display cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    AXIOM
                </motion.div>

                <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="hidden md:flex gap-1 text-sm font-medium text-gray-400 bg-white/5 p-1.5 rounded-full border border-white/10"
                >
                    {[
                        { label: 'Home', path: '/' },
                        { label: 'Documentation', path: '/docs' },
                        { label: 'Pricing', path: '/pricing' }
                    ].map(item => (
                        <button
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            className={`px-6 py-2 rounded-full transition-all duration-300 tracking-wide uppercase text-xs ${isActive(item.path)
                                ? 'bg-white text-black shadow-glow font-bold'
                                : 'hover:bg-white/10 hover:text-white text-gray-400'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </motion.nav>

                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/app')}
                    className="px-6 py-2.5 text-sm font-bold bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-glow hover:bg-gray-200 tracking-wide"
                >
                    Launch App
                </motion.button>
            </div>
        </header>
    );
};

export default PublicNavbar;
