import React, { useMemo, useState } from 'react';
import { ExternalLink, PlayCircle, BookOpen, Clock3, RotateCcw } from 'lucide-react';
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

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const DsaTopicAccordion = ({
    topic,
    solvedSet,
    pendingProblemSet = new Set(),
    isExpanded,
    focusedProblemId,
    problemMetaById = {},
    onToggleExpand,
    onToggleProblem,
    onSaveProblemMeta,
    onCompleteReview,
}) => {
    const [journalProblemId, setJournalProblemId] = useState('');
    const [draftByProblemId, setDraftByProblemId] = useState({});
    const [savingProblemId, setSavingProblemId] = useState('');
    const [reviewingProblemId, setReviewingProblemId] = useState('');

    const solvedCount = useMemo(() => (
        topic.problems.reduce((sum, problem) => sum + (solvedSet.has(problem.id) ? 1 : 0), 0)
    ), [topic.problems, solvedSet]);

    const progress = topic.total > 0 ? Math.round((solvedCount / topic.total) * 100) : 0;

    const getDraft = (problemId) => {
        if (draftByProblemId[problemId]) {
            return draftByProblemId[problemId];
        }
        const meta = problemMetaById[problemId] || {};
        return {
            notes: meta.notes || '',
            timeSpentMinutes: toInt(meta.timeSpentMinutes, 0),
            attempts: toInt(meta.attempts, 0),
            reviewIntervalDays: toInt(meta.reviewIntervalDays, 1) || 1,
        };
    };

    const openJournal = (problemId) => {
        const nextDraft = getDraft(problemId);
        setDraftByProblemId((prev) => ({
            ...prev,
            [problemId]: nextDraft,
        }));
        setJournalProblemId((prev) => (prev === problemId ? '' : problemId));
    };

    const updateDraft = (problemId, patch) => {
        setDraftByProblemId((prev) => ({
            ...prev,
            [problemId]: {
                ...getDraft(problemId),
                ...patch,
            },
        }));
    };

    const handleSave = async (problemId) => {
        if (!onSaveProblemMeta) return;
        const draft = getDraft(problemId);
        setSavingProblemId(problemId);
        try {
            await onSaveProblemMeta(problemId, {
                notes: draft.notes,
                timeSpentMinutes: toInt(draft.timeSpentMinutes, 0),
                attempts: toInt(draft.attempts, 0),
                reviewIntervalDays: Math.max(1, toInt(draft.reviewIntervalDays, 1)),
            });
        } finally {
            setSavingProblemId('');
        }
    };

    const handleReview = async (problemId, rating) => {
        if (!onCompleteReview) return;
        setReviewingProblemId(problemId);
        try {
            await onCompleteReview(problemId, rating);
        } finally {
            setReviewingProblemId('');
        }
    };

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
                                const isPendingToggle = pendingProblemSet.has(problem.id);
                                const tags = Array.isArray(problem.company_tags) ? problem.company_tags : [];
                                const meta = problemMetaById[problem.id] || {};
                                const isJournalOpen = journalProblemId === problem.id;
                                const isFocused = focusedProblemId && focusedProblemId === problem.id;

                                return (
                                    <div
                                        key={problem.id}
                                        className={`px-5 py-3 transition-colors ${isFocused ? 'bg-foreground/10' : 'hover:bg-foreground/5'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <button
                                                type="button"
                                                onClick={() => onToggleProblem(problem.id, topic.id)}
                                                disabled={isPendingToggle}
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
                                                    {tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={`${problem.id}-${tag}`}
                                                            className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border border-sky-500/30 text-sky-500 bg-sky-500/10"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-3 mt-1">
                                                    <p className="text-[11px] text-muted-foreground font-mono truncate">{problem.id}</p>
                                                    <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                                                        <Clock3 className="w-3 h-3" /> {toInt(meta.timeSpentMinutes, 0)} min
                                                    </p>
                                                    {isSolved && (
                                                        <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                                                            <RotateCcw className="w-3 h-3" /> review in {toInt(meta.reviewIntervalDays, 1)}d
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => openJournal(problem.id)}
                                                    className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors"
                                                    title="Notes & time"
                                                >
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                </button>
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

                                        <AnimatePresence initial={false}>
                                            {isJournalOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.16 }}
                                                    className="mt-3 border border-border/70 rounded-xl p-3 bg-background/40"
                                                >
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                                        <div className="md:col-span-2">
                                                            <label className="text-xs text-muted-foreground block mb-1">Notes</label>
                                                            <textarea
                                                                value={getDraft(problem.id).notes}
                                                                onChange={(event) => updateDraft(problem.id, { notes: event.target.value })}
                                                                rows={3}
                                                                placeholder="Write revision notes, edge cases, mistakes..."
                                                                className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div>
                                                                <label className="text-xs text-muted-foreground block mb-1">Time (minutes)</label>
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={getDraft(problem.id).timeSpentMinutes}
                                                                    onChange={(event) => updateDraft(problem.id, { timeSpentMinutes: event.target.value })}
                                                                    className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-muted-foreground block mb-1">Review interval (days)</label>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="120"
                                                                    value={getDraft(problem.id).reviewIntervalDays}
                                                                    onChange={(event) => updateDraft(problem.id, { reviewIntervalDays: event.target.value })}
                                                                    className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSave(problem.id)}
                                                            className="rounded-lg bg-foreground text-background px-3 py-1.5 text-xs font-semibold hover:opacity-90"
                                                            disabled={savingProblemId === problem.id}
                                                        >
                                                            {savingProblemId === problem.id ? 'Saving...' : 'Save Notes'}
                                                        </button>

                                                        {isSolved && (
                                                            <>
                                                                {['again', 'hard', 'good', 'easy'].map((rating) => (
                                                                    <button
                                                                        key={`${problem.id}-${rating}`}
                                                                        type="button"
                                                                        onClick={() => handleReview(problem.id, rating)}
                                                                        disabled={reviewingProblemId === problem.id}
                                                                        className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40"
                                                                    >
                                                                        {rating}
                                                                    </button>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
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
