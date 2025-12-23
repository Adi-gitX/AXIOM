import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Circle, ExternalLink, Trophy } from 'lucide-react';
import { TOPICS } from '../data/dsaSheet';
import useStore from '../store/useStore';

const DSATracker = () => {
    const { solvedProblems } = useStore();
    
    // Calculate total progress
    const totalProblems = TOPICS.reduce((acc, topic) => acc + topic.total, 0);
    const solvedCount = solvedProblems.length;
    const progressPercentage = Math.round((solvedCount / totalProblems) * 100);

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 glass-panel p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-display font-bold text-text">Striver's A2Z DSA Sheet</h1>
                        <p className="text-textMuted mt-2">Track your journey to mastery. Complete problems to level up.</p>
                    </div>
                    <div className="mt-6 flex items-end gap-2 text-primary font-display font-bold">
                        <span className="text-5xl">{solvedCount}</span>
                        <span className="text-xl text-textMuted mb-2">/ {totalProblems} Solved</span>
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="glass-panel p-6 flex items-center justify-center relative">
                     <div className="text-center relative z-10">
                        <Trophy size={48} className="mx-auto text-yellow-500 mb-2" />
                        <h3 className="text-xl font-bold text-text">{progressPercentage}% Complete</h3>
                        <p className="text-sm text-textMuted">Keep pushing!</p>
                     </div>
                     {/* Circular Progress Ring */}
                     <svg className="absolute inset-0 w-full h-full -rotate-90 p-4" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-surfaceHighlight" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-primary transition-all duration-1000 ease-out" strokeWidth="8"
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * progressPercentage) / 100}
                             strokeLinecap="round"
                        />
                     </svg>
                </div>
            </div>

            {/* Accordion Topics */}
            <div className="space-y-4">
                {TOPICS.map((topic) => (
                    <AccordionItem key={topic.id} topic={topic} />
                ))}
            </div>
        </div>
    );
};

const AccordionItem = ({ topic }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { solvedProblems, toggleProblem } = useStore();
    
    // Calculate solved for this specific topic based on global state
    const topicProblemIds = topic.problems.map(p => p.id);
    const solvedInTopic = topicProblemIds.filter(id => solvedProblems.includes(id)).length;

    return (
        <div className="border border-border rounded-xl bg-surface/50 overflow-hidden transition-all duration-300 hover:border-border/80">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left group"
            >
                <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-surfaceHighlight flex items-center justify-center text-primary font-bold">
                        {topic.id}
                    </span>
                    <div>
                        <h3 className="font-medium text-text text-lg group-hover:text-primary transition-colors">
                            {topic.name}
                        </h3>
                        <p className="text-textMuted text-sm">
                            {solvedInTopic} / {topic.total} Solved
                        </p>
                    </div>
                </div>
                <ChevronDown 
                    className={`text-textMuted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-5 pb-5 pt-0 border-t border-border/50">
                            <div className="grid gap-2 mt-4">
                                {topic.problems.map((prob) => {
                                    const isSolved = solvedProblems.includes(prob.id);
                                    return (
                                        <div key={prob.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surfaceHighlight/50 transition-colors group/item">
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => toggleProblem(prob.id)}
                                                    className="text-textMuted hover:text-green-500 transition-colors"
                                                >
                                                    {isSolved 
                                                        ? <CheckCircle2 size={20} className="text-green-500" /> 
                                                        : <Circle size={20} />
                                                    }
                                                </button>
                                                <span className={`font-medium ${isSolved ? 'text-textMuted line-through' : 'text-text'}`}>
                                                    {prob.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-xs px-2 py-1 rounded bg-surfaceHighlight font-medium
                                                    ${prob.difficulty === 'Easy' ? 'text-green-400' : ''}
                                                    ${prob.difficulty === 'Medium' ? 'text-yellow-400' : ''}
                                                    ${prob.difficulty === 'Hard' ? 'text-red-400' : ''}
                                                `}>
                                                    {prob.difficulty}
                                                </span>
                                                <a href={prob.link} target="_blank" rel="noopener noreferrer" className="text-textMuted hover:text-primary opacity-0 group-hover/item:opacity-100 transition-all">
                                                    <ExternalLink size={18} />
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
