import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { TOPICS } from '../data/dsaSheet';
import GlassCard from '../components/ui/GlassCard';

const Dashboard = () => {
    const navigate = useNavigate();
    const { solvedProblems } = useStore();

    const totalProblems = TOPICS.reduce((acc, topic) => acc + topic.total, 0);
    const solvedCount = solvedProblems.length;
    const progress = Math.round((solvedCount / totalProblems) * 100);

    const stats = [
        { label: 'Problems Solved', value: solvedCount },
        { label: 'Day Streak', value: 7 },
        { label: 'Hours Studied', value: 24 },
        { label: 'Completion', value: `${progress}%` },
    ];

    const links = [
        { name: 'Education', path: '/app/education', desc: '18 topics' },
        { name: 'DSA Tracker', path: '/app/dsa', desc: `${solvedCount}/${totalProblems}` },
        { name: 'Interview Prep', path: '/app/interview', desc: '5 areas' },
        { name: 'Jobs', path: '/app/jobs', desc: '12 new' },
        { name: 'Posts', path: '/app/posts', desc: '6 articles' },
        { name: 'Dev Connect', path: '/app/connect', desc: 'Chat' },
    ];

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const activity = [4, 7, 3, 9, 5, 8, 6];
    const max = Math.max(...activity);

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl font-light text-white font-display tracking-tight mb-2">Dashboard</h1>
                    <p className="text-gray-400 text-lg font-light">Your command center</p>
                </motion.header>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <GlassCard
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-6 flex flex-col items-start justify-center"
                        >
                            <p className="text-4xl font-light text-white mb-2">{stat.value}</p>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                        </GlassCard>
                    ))}
                </div>

                {/* Activity and Quick Access Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Activity Chart */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Weekly Activity</h2>
                        <GlassCard className="p-8">
                            <div className="flex items-end justify-between gap-4 h-40">
                                {days.map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(activity[i] / max) * 100}%` }}
                                            transition={{ delay: i * 0.05, duration: 0.6, ease: "circOut" }}
                                            className={`w-full rounded-full ${i === 3 ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-white/10'}`}
                                            style={{ minHeight: 8 }}
                                        />
                                        <span className={`text-xs font-mono ${i === 3 ? 'text-white font-bold' : 'text-gray-500'}`}>{day}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Quick Access Links */}
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Quick Access</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {links.slice(0, 3).map((link, i) => (
                                <GlassCard
                                    key={link.name}
                                    hoverEffect={true}
                                    onClick={() => navigate(link.path)}
                                    className="p-4 flex items-center justify-between group cursor-pointer"
                                >
                                    <div>
                                        <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">{link.name}</span>
                                        <p className="text-xs text-gray-500 group-hover:text-gray-400 mt-1">{link.desc}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </GlassCard>
                            ))}
                            <div className="grid grid-cols-2 gap-3">
                                {links.slice(3).map((link, i) => (
                                    <GlassCard
                                        key={link.name}
                                        hoverEffect={true}
                                        onClick={() => navigate(link.path)}
                                        className="p-4 flex flex-col justify-center items-center text-center group cursor-pointer"
                                    >
                                        <span className="font-medium text-gray-300 group-hover:text-white transition-colors">{link.name}</span>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
