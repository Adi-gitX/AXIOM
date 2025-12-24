import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const JOBS = [
    { id: 1, title: 'Frontend Developer', company: 'Google', location: 'Remote', type: 'Full-time', salary: '$150K - $200K', posted: '2d ago' },
    { id: 2, title: 'Backend Engineer', company: 'Meta', location: 'Menlo Park, CA', type: 'Full-time', salary: '$170K - $220K', posted: '3d ago' },
    { id: 3, title: 'Full Stack Developer', company: 'Stripe', location: 'San Francisco', type: 'Full-time', salary: '$160K - $210K', posted: '1w ago' },
    { id: 4, title: 'React Developer', company: 'Airbnb', location: 'Remote', type: 'Contract', salary: '$80/hr', posted: '1w ago' },
    { id: 5, title: 'Software Engineer', company: 'Netflix', location: 'Los Gatos, CA', type: 'Full-time', salary: '$180K - $250K', posted: '2w ago' },
    { id: 6, title: 'DevOps Engineer', company: 'Spotify', location: 'Remote', type: 'Full-time', salary: '$140K - $180K', posted: '2w ago' },
];

const Jobs = () => {
    const [filter, setFilter] = useState('All');
    const { savedJobs, saveJob } = useStore();

    const filters = ['All', 'Remote', 'Full-time', 'Contract'];

    const filteredJobs = filter === 'All'
        ? JOBS
        : JOBS.filter(j => j.location.includes('Remote') && filter === 'Remote' || j.type === filter);

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light text-white text-glow font-display">Jobs</h1>
                    <p className="text-gray-400 mt-2">Find your next opportunity</p>
                </motion.header>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm rounded-full transition-all border ${filter === f
                                ? 'bg-white text-black border-white shadow-glow font-medium'
                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Jobs */}
                <div className="space-y-4">
                    {filteredJobs.map((job, i) => {
                        const saved = savedJobs.includes(job.id);
                        return (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="glass-card p-6 rounded-2xl hover:bg-white/5 transition-all group border border-white/5 hover:border-white/20"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-white group-hover:text-glow transition-all">{job.title}</h3>
                                        <p className="text-sm text-gray-400 mt-1">{job.company}</p>
                                        <div className="flex items-center gap-3 mt-4 text-xs text-gray-500 font-mono">
                                            <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{job.location}</span>
                                            <span>{job.salary}</span>
                                            <span>{job.posted}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-white/60 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">{job.type}</span>
                                        <button
                                            onClick={() => saveJob(job.id)}
                                            className={`p-2 rounded-xl transition-all ${saved ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Jobs;
