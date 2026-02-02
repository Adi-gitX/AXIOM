import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useStore, { setUserEmail } from '../store/useStore';
import { TOPICS } from '../data/dsaSheet';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../contexts/AuthContext';

const DSATracker = () => {
    const { currentUser } = useAuth();
    const { solvedProblems, toggleProblem, loadSolvedProblems } = useStore();
    const [expandedTopic, setExpandedTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load solved problems from backend on mount
    useEffect(() => {
        const initProgress = async () => {
            if (currentUser?.email) {
                setUserEmail(currentUser.email);
                await loadSolvedProblems(currentUser.email);
            }
            setLoading(false);
        };
        initProgress();
    }, [currentUser?.email, loadSolvedProblems]);

    const totalProblems = TOPICS.reduce((acc, t) => acc + t.total, 0);
    const totalSolved = solvedProblems.length;
    const overallProgress = Math.round((totalSolved / totalProblems) * 100);

    const handleToggleProblem = (problemId, topicId) => {
        toggleProblem(problemId, topicId);
    };

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8"
                >
                    <h1 className="text-5xl font-light text-foreground font-display tracking-tight">DSA Tracker</h1>
                    <p className="text-muted-foreground text-lg font-light mt-2">Master problem solving, one topic at a time.</p>
                </motion.header>

                {/* Overall Progress */}
                <GlassCard className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-3xl font-light text-foreground">
                                {loading ? '...' : `${totalSolved} / ${totalProblems}`}
                            </p>
                            <p className="text-muted-foreground font-medium">Problems Solved</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-light text-foreground">
                                {loading ? '...' : `${overallProgress}%`}
                            </p>
                            <p className="text-muted-foreground font-medium">Complete</p>
                        </div>
                    </div>
                    <div className="h-3 w-full rounded-full bg-foreground/10 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                            transition={{ duration: 0.8, ease: 'circOut' }}
                            className="h-full rounded-full bg-foreground"
                        />
                    </div>
                </GlassCard>

                {/* Topics List */}
                <div className="space-y-4">
                    {TOPICS.map((topic, i) => {
                        const solved = topic.problems.filter(p => solvedProblems.includes(p.id)).length;
                        const progress = Math.round((solved / topic.total) * 100);
                        const isExpanded = expandedTopic === topic.id;

                        return (
                            <motion.div
                                key={topic.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <GlassCard
                                    hoverEffect={true}
                                    className="overflow-hidden"
                                    onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                                >
                                    {/* Topic Header */}
                                    <div className="p-5 flex items-center justify-between cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-medium text-foreground">{topic.name}</span>
                                            <span className="text-sm text-muted-foreground font-mono">{solved}/{topic.total}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-32 h-2 rounded-full bg-foreground/10 overflow-hidden">
                                                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${progress}%` }} />
                                            </div>
                                            <span className="text-sm font-mono text-muted-foreground">{progress}%</span>
                                            <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Problem List */}
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="border-t border-border/50 bg-background/30"
                                        >
                                            {topic.problems.map((problem) => {
                                                const isSolved = solvedProblems.includes(problem.id);
                                                return (
                                                    <div
                                                        key={problem.id}
                                                        className="px-5 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleToggleProblem(problem.id, topic.id); }}
                                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSolved ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/50 hover:border-foreground'}`}
                                                            >
                                                                {isSolved && (
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                            <span className={`font-medium ${isSolved ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                                {problem.title}
                                                            </span>
                                                        </div>
                                                        <span className={`text-xs font-mono px-2 py-1 rounded ${problem.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                problem.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                                    'bg-rose-500/20 text-rose-400'
                                                            }`}>
                                                            {problem.difficulty}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DSATracker;
