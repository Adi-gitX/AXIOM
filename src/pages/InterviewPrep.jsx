import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RESOURCES = [
    { id: 1, cat: 'Behavioral', title: 'STAR Method Guide', desc: 'Structure your answers' },
    { id: 2, cat: 'Behavioral', title: 'Common Questions', desc: '50 most asked questions' },
    { id: 3, cat: 'System Design', title: 'Design Patterns', desc: 'Essential patterns' },
    { id: 4, cat: 'System Design', title: 'Scalability Basics', desc: 'How to scale systems' },
    { id: 5, cat: 'Coding', title: 'Time Complexity', desc: 'Big O notation' },
    { id: 6, cat: 'Coding', title: 'Problem Solving', desc: 'Approach any problem' },
    { id: 7, cat: 'Resume', title: 'Tech Resume Guide', desc: 'Craft the perfect resume' },
    { id: 8, cat: 'Resume', title: 'Project Showcase', desc: 'Present your work' },
];

const CATS = ['All', 'Behavioral', 'System Design', 'Coding', 'Resume'];

const TIPS = [
    "Research the company's engineering blog before interviews",
    "Practice explaining your thought process out loud",
    "Prepare 2-3 questions to ask your interviewer",
    "Review your past projects and be ready to discuss them",
];

const InterviewPrep = () => {
    const [cat, setCat] = useState('All');
    const filtered = cat === 'All' ? RESOURCES : RESOURCES.filter(r => r.cat === cat);

    return (
        <div className="min-h-screen bg-white p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light text-gray-900">Interview Prep</h1>
                    <p className="text-gray-400 mt-2">Resources to ace your interviews</p>
                </motion.header>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {CATS.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className={`px-4 py-2 text-sm rounded-full transition-all ${cat === c ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
                    {filtered.map((r, i) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                            <span className="text-xs text-gray-400">{r.cat}</span>
                            <h3 className="font-medium text-gray-900 mt-1 group-hover:text-gray-600 transition-colors">{r.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{r.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tips */}
                <div>
                    <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Quick Tips</h2>
                    <div className="space-y-3">
                        {TIPS.map((tip, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                            >
                                <span className="text-xs text-gray-300 font-mono">{String(i + 1).padStart(2, '0')}</span>
                                <p className="text-gray-700 text-sm">{tip}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InterviewPrep;
