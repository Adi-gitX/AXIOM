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
        <div className="min-h-screen bg-white p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light text-gray-900">Jobs</h1>
                    <p className="text-gray-400 mt-2">Find your next opportunity</p>
                </motion.header>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm rounded-full transition-all ${filter === f
                                ? 'bg-gray-900 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Jobs */}
                <div className="space-y-3">
                    {filteredJobs.map((job, i) => {
                        const saved = savedJobs.includes(job.id);
                        return (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                                            <span>{job.location}</span>
                                            <span>·</span>
                                            <span>{job.salary}</span>
                                            <span>·</span>
                                            <span>{job.posted}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">{job.type}</span>
                                        <button
                                            onClick={() => saveJob(job.id)}
                                            className={`p-2 rounded-lg transition-colors ${saved ? 'text-gray-900' : 'text-gray-300 hover:text-gray-600'}`}
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
