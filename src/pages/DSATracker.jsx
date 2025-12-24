import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Circle, ExternalLink, Trophy, Target, Flame } from 'lucide-react';
import { TOPICS } from '../data/dsaSheet';
import useStore from '../store/useStore';

const DSATracker = () => {
    const { solvedProblems } = useStore();

    // Calculate total progress
    const totalProblems = TOPICS.reduce((acc, topic) => acc + topic.total, 0);
    const solvedCount = solvedProblems.length;
    const progressPercentage = Math.round((solvedCount / totalProblems) * 100);

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-[1100px] mx-auto space-y-8">

                {/* Header */}
                <header>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display mb-2">
                        DSA Tracker
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Master data structures and algorithms with Striver's A2Z Sheet
                    </p>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Progress Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Progress</p>
                                <p className="text-4xl font-bold text-gray-900">
                                    {solvedCount} <span className="text-xl text-gray-400 font-normal">/ {totalProblems}</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Target size={24} className="text-blue-600" />
                            </div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1 }}
                                className="h-full bg-gray-900 rounded-full"
                            />
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{progressPercentage}% complete</p>
                    </div>

                    {/* Trophy Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                            <Trophy size={28} className="text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{progressPercentage}%</p>
                        <p className="text-sm text-gray-500">Completion Rate</p>
                    </div>
                </div>

                {/* Topics Accordion */}
                <div className="space-y-3">
                    {TOPICS.map((topic) => (
                        <AccordionItem key={topic.id} topic={topic} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const AccordionItem = ({ topic }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { solvedProblems, toggleProblem } = useStore();

    // Calculate solved for this specific topic
    const topicProblemIds = topic.problems.map(p => p.id);
    const solvedInTopic = topicProblemIds.filter(id => solvedProblems.includes(id)).length;
    const isComplete = solvedInTopic === topic.total;
    const progressPercent = (solvedInTopic / topic.total) * 100;

    return (
        <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-gray-200 shadow-sm' : 'border-gray-100 hover:border-gray-200'
            }`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left group"
            >
                <div className="flex items-center gap-4">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${isComplete
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-900 group-hover:text-white'
                        }`}>
                        {isComplete ? <CheckCircle2 size={20} /> : topic.id}
                    </span>
                    <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {topic.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-gray-900'}`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 font-medium">
                                {solvedInTopic} / {topic.total}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-gray-100 rotate-180' : 'text-gray-400 group-hover:text-gray-600'
                    }`}>
                    <ChevronDown size={18} />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-5 pb-5 pt-0">
                            <div className="pl-14 space-y-1">
                                {topic.problems.map((prob) => {
                                    const isSolved = solvedProblems.includes(prob.id);
                                    return (
                                        <div
                                            key={prob.id}
                                            className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors group/item"
                                        >
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => toggleProblem(prob.id)}
                                                    className={`transition-all duration-200 ${isSolved
                                                        ? 'text-emerald-500'
                                                        : 'text-gray-300 hover:text-gray-500'
                                                        }`}
                                                >
                                                    {isSolved
                                                        ? <CheckCircle2 size={20} className="fill-emerald-50" />
                                                        : <Circle size={20} />
                                                    }
                                                </button>
                                                <span className={`font-medium transition-colors ${isSolved ? 'text-gray-400 line-through' : 'text-gray-700'
                                                    }`}>
                                                    {prob.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                                                    prob.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-red-50 text-red-600'
                                                    }`}>
                                                    {prob.difficulty}
                                                </span>
                                                <a
                                                    href={prob.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-gray-300 hover:text-blue-600 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-blue-50 rounded-lg"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DSATracker;
