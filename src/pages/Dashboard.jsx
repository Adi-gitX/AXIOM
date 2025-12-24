import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { TOPICS } from '../data/dsaSheet';

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
        <div className="min-h-screen bg-white p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light text-gray-900">Dashboard</h1>
                    <p className="text-gray-400 mt-2">Your learning overview</p>
                </motion.header>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 bg-gray-50 rounded-xl"
                        >
                            <p className="text-3xl font-light text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Activity */}
                <div className="mb-12">
                    <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">This Week</h2>
                    <div className="p-6 bg-gray-50 rounded-xl">
                        <div className="flex items-end justify-between gap-3 h-24">
                            {days.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(activity[i] / max) * 100}%` }}
                                        transition={{ delay: i * 0.05, duration: 0.4 }}
                                        className={`w-full rounded-md ${i === 3 ? 'bg-gray-900' : 'bg-gray-200'}`}
                                        style={{ minHeight: 8 }}
                                    />
                                    <span className={`text-xs ${i === 3 ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Links */}
                <div>
                    <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Quick Access</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {links.map((link, i) => (
                            <motion.button
                                key={link.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => navigate(link.path)}
                                className="p-5 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors group"
                            >
                                <span className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{link.name}</span>
                                <p className="text-xs text-gray-400 mt-1">{link.desc}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
