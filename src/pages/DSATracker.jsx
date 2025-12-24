import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS } from '../data/dsaSheet';
import useStore from '../store/useStore';

const DSATracker = () => {
    const { solvedProblems } = useStore();
    const [expanded, setExpanded] = useState(null);

    const total = TOPICS.reduce((acc, t) => acc + t.total, 0);
    const solved = solvedProblems.length;
    const progress = Math.round((solved / total) * 100);

    return (
        <div className="min-h-screen bg-white p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-light text-gray-900">DSA Tracker</h1>
                    <p className="text-gray-400 mt-2">Striver's A2Z Sheet</p>
                </motion.header>

                {/* Progress */}
                <div className="mb-12">
                    <div className="flex items-end justify-between mb-3">
                        <div>
                            <p className="text-5xl font-light text-gray-900">{solved}</p>
                            <p className="text-gray-400 mt-1">of {total} problems</p>
                        </div>
                        <p className="text-3xl font-light text-gray-300">{progress}%</p>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.6 }}
                            className="h-full bg-gray-900 rounded-full"
                        />
                    </div>
                </div>

                {/* Topics */}
                <div className="space-y-2">
                    {TOPICS.map((topic, i) => (
                        <TopicItem
                            key={topic.id}
                            topic={topic}
                            index={i}
                            isOpen={expanded === topic.id}
                            onToggle={() => setExpanded(expanded === topic.id ? null : topic.id)}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

const TopicItem = ({ topic, index, isOpen, onToggle }) => {
    const { solvedProblems, toggleProblem } = useStore();
    const solvedHere = topic.problems.filter(p => solvedProblems.includes(p.id)).length;

    return (
        <div className="bg-gray-50 rounded-xl overflow-hidden">
            <button onClick={onToggle} className="w-full flex items-center justify-between p-5 text-left group">
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400 font-mono w-5">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                        <h3 className="font-medium text-gray-900">{topic.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{solvedHere}/{topic.total}</p>
                    </div>
                </div>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="w-4 h-4 text-gray-400"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                >
                    <path d="M19 9l-7 7-7-7" />
                </motion.svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 space-y-1">
                            {topic.problems.map((p) => {
                                const done = solvedProblems.includes(p.id);
                                return (
                                    <div key={p.id} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleProblem(p.id)}
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${done ? 'bg-gray-900 border-gray-900' : 'border-gray-300 hover:border-gray-500'
                                                    }`}
                                            >
                                                {done && (
                                                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <path d="M20 6L9 17l-5-5" />
                                                    </svg>
                                                )}
                                            </button>
                                            <span className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{p.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-0.5 rounded ${p.difficulty === 'Easy' ? 'bg-gray-100 text-gray-500' :
                                                    p.difficulty === 'Medium' ? 'bg-gray-200 text-gray-600' : 'bg-gray-300 text-gray-700'
                                                }`}>{p.difficulty}</span>
                                            <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-600" onClick={(e) => e.stopPropagation()}>
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DSATracker;
