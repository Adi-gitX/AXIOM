import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';

const Dashboard = () => {
    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Welcome Back, Dev</h1>
                    <p className="text-textMuted">Here's your daily briefing.</p>
                </div>
                <div className="flex gap-4">
                    {/* Placeholder for user profile or quick actions */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20" />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Stats Area */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="h-80 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                        <h2 className="text-2xl font-bold mb-4">Activity Overview</h2>
                        <div className="h-full flex items-center justify-center text-textMuted">
                            {/* Placeholder for Chart */}
                            [Activity Graph Component Placeholder]
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-2 gap-6">
                        <GlassCard>
                            <h3 className="text-lg font-medium text-textMuted mb-2">Problems Solved</h3>
                            <p className="text-4xl font-bold text-white">124</p>
                            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[65%]" />
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <h3 className="text-lg font-medium text-textMuted mb-2">Streak</h3>
                            <p className="text-4xl font-bold text-white">7 Days</p>
                            <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[100%]" />
                            </div>
                        </GlassCard>
                    </div>
                </div>

                {/* Sidebar / Recommended */}
                <div className="space-y-6">
                    <GlassCard className="h-full">
                        <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
                        <ul className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="flex gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                    <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">📺</div>
                                    <div>
                                        <p className="font-medium text-sm">System Design: Scaling Load Balancers</p>
                                        <p className="text-xs text-textMuted">20 mins • High Priority</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
