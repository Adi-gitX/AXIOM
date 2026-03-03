import React, { useMemo } from 'react';
import { ExternalLink, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

const difficultyClasses = {
    Easy: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    Hard: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
    Unknown: 'bg-foreground/10 text-muted-foreground border-border',
};

const sourceClasses = {
    leetcode: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
    geeksforgeeks: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    interviewbit: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    other: 'bg-foreground/10 text-muted-foreground border-border',
};

const prettifySource = (source) => {
    if (source === 'geeksforgeeks') return 'GFG';
    if (source === 'interviewbit') return 'InterviewBit';
    if (source === 'leetcode') return 'LeetCode';
    return 'Other';
};

const DsaTopicAccordion = ({ topic, solvedSet, isExpanded, onToggleExpand, onToggleProblem }) => {
    const solvedCount = useMemo(() => (
        topic.problems.reduce((sum, problem) => sum + (solvedSet.has(problem.id) ? 1 : 0), 0)
    ), [topic.problems, solvedSet]);

    const progress = topic.total > 0 ? Math.round((solvedCount / topic.total) * 100) : 0;

    return (
        <GlassCard className="overflow-hidden p-0" hoverEffect={false}>
            <button
                type="button"
                onClick={onToggleExpand}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-foreground/5 transition-colors"
            >
                <div>
                    <p className="font-semibold text-foreground">{topic.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{solvedCount}/{topic.total} solved</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                        <div className="h-full rounded-full bg-foreground" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{progress}%</span>
                    <svg className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border/60"
                    >
                        <div className="divide-y divide-border/50">
                            {topic.problems.map((problem) => {
                                const isSolved = solvedSet.has(problem.id);
                                return (
                                    <div key={problem.id} className="px-5 py-3 flex items-start gap-3 hover:bg-foreground/5 transition-colors">
                                        <button
                                            type="button"
                                            onClick={() => onToggleProblem(problem.id, topic.id)}
                                            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSolved
                                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                                : 'border-muted-foreground/40 hover:border-foreground'
                                                }`}
                                            aria-label={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
                                        >
                                            {isSolved && (
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <a
                                                    href={problem.external_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`font-medium text-sm hover:underline ${isSolved ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                                                >
                                                    {problem.title}
                                                </a>
                                                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${difficultyClasses[problem.difficulty] || difficultyClasses.Unknown}`}>
                                                    {problem.difficulty}
                                                </span>
                                                <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${sourceClasses[problem.source_platform] || sourceClasses.other}`}>
                                                    {prettifySource(problem.source_platform)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-muted-foreground font-mono mt-1 truncate">{problem.id}</p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-0.5">
                                            <a
                                                href={problem.external_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                                                title="Open problem"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                            {problem.solution_url && (
                                                <a
                                                    href={problem.solution_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                                                    title="Open solution"
                                                >
                                                    <PlayCircle className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
};

export default DsaTopicAccordion;
