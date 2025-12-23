import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Circle, ExternalLink, Trophy } from 'lucide-react';
import { TOPICS } from '../data/dsaSheet';
import useStore from '../store/useStore';
import GlassCard from '../components/ui/GlassCard';

const DSATracker = () => {
    const { solvedProblems, toggleProblem } = useStore();
    
    // Calculate total progress
    const totalProblems = TOPICS.reduce((acc, topic) => acc + topic.total, 0);
    const solvedCount = solvedProblems.length;
    const progressPercentage = Math.round((solvedCount / totalProblems) * 100);

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-10">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="md:col-span-2 flex flex-col justify-between relative overflow-hidden h-64 border-blue-500/20">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Striver's A2Z DSA Sheet</h1>
                        <p className="text-white/60 text-lg">Track your journey to mastery. Complete problems to level up.</p>
                    </div>
                    <div className="mt-6 flex items-end gap-3 font-display font-bold">
                        <span className="text-6xl text-blue-500 text-shadow-glow">{solvedCount}</span>
                        <span className="text-2xl text-white/40 mb-3">/ {totalProblems} Solved</span>
                    </div>
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                </GlassCard>

                <GlassCard className="flex items-center justify-center relative h-64 border-purple-500/20">
                     <div className="text-center relative z-10">
                        <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                            <Trophy size={32} className="text-yellow-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">{progressPercentage}% </h3>
                        <p className="text-sm text-white/50 uppercase tracking-widest font-semibold">Complete</p>
                     </div>
                     {/* Circular Progress Ring */}
                     <svg className="absolute inset-0 w-full h-full -rotate-90 p-4 opacity-50" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-white/5" strokeWidth="6" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-blue-500 transition-all duration-1000 ease-out" strokeWidth="6"
                            strokeDasharray="264"
                            strokeDashoffset={264 - (264 * progressPercentage) / 100}
                             strokeLinecap="round"
                        />
                     </svg>
                </GlassCard>
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
    const isComplete = solvedInTopic === topic.total;

    return (
        <motion.div 
            className={`rounded-2xl border transition-all duration-500 overflow-hidden ${isOpen ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 hover:bg-white/5'}`}
            initial={false}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left group"
            >
                <div className="flex items-center gap-5">
                    <span className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl transition-colors
                        ${isComplete ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/70 group-hover:bg-blue-500/20 group-hover:text-blue-400'}
                    `}>
                        {isComplete ? <CheckCircle2 size={24} /> : topic.id}
                    </span>
                    <div>
                        <h3 className="font-bold text-white text-xl group-hover:text-blue-400 transition-colors">
                            {topic.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                             <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                                    style={{ width: `${(solvedInTopic / topic.total) * 100}%` }}
                                />
                             </div>
                             <p className="text-white/40 text-xs font-medium">
                                {solvedInTopic} / {topic.total}
                             </p>
                        </div>
                    </div>
                </div>
                <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-white/10 rotate-180' : 'text-white/30 group-hover:text-white'}`}>
                     <ChevronDown size={20} />
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
                        <div className="px-6 pb-6 pt-0">
                            <div className="pl-[4.25rem] grid gap-2">
                                {topic.problems.map((prob) => {
                                    const isSolved = solvedProblems.includes(prob.id);
                                    return (
                                        <div key={prob.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group/item border border-transparent hover:border-white/5">
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={() => toggleProblem(prob.id)}
                                                    className={`transition-all duration-300 ${isSolved ? 'text-green-500 scale-110' : 'text-white/20 hover:text-white hover:scale-110'}`}
                                                >
                                                    {isSolved 
                                                        ? <CheckCircle2 size={22} className="fill-green-500/10" /> 
                                                        : <Circle size={22} />
                                                    }
                                                </button>
                                                <span className={`font-medium text-lg transition-colors ${isSolved ? 'text-white/30 line-through' : 'text-white/90'}`}>
                                                    {prob.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider
                                                    ${prob.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' : ''}
                                                    ${prob.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                                                    ${prob.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400' : ''}
                                                `}>
                                                    {prob.difficulty}
                                                </span>
                                                <a href={prob.link} target="_blank" rel="noopener noreferrer" className="p-2 text-white/30 hover:text-blue-400 opacity-0 group-hover/item:opacity-100 transition-all hover:bg-blue-500/10 rounded-lg">
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
        </motion.div>
    );
};

export default DSATracker;
