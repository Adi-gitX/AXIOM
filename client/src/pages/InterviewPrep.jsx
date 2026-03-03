import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { interviewApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const InterviewPrep = () => {
    const { currentUser } = useAuth();
    const [cat, setCat] = useState('All');
    const [resources, setResources] = useState([]);
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [savingId, setSavingId] = useState(null);
    const [retryNonce, setRetryNonce] = useState(0);
    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );

    useEffect(() => {
        const loadResources = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await interviewApi.getResources({
                    email: currentUser?.email || '',
                });
                setResources(Array.isArray(data.resources) ? data.resources : []);
                setTips(Array.isArray(data.tips) ? data.tips : []);
            } catch (err) {
                if (!isTransientApiError(err)) {
                    console.error('Failed to load interview resources:', err);
                }
                setError('Failed to load interview resources');
            } finally {
                setLoading(false);
            }
        };

        loadResources();
    }, [currentUser?.email, retryNonce]);

    const categories = useMemo(
        () => ['All', ...new Set(resources.map((r) => r.category).filter(Boolean))],
        [resources]
    );

    const filtered = useMemo(
        () => (cat === 'All' ? resources : resources.filter((r) => r.category === cat)),
        [cat, resources]
    );

    const toggleCompleted = async (resource) => {
        if (!currentUser?.email || !resource?.id) return;
        const nextCompleted = !resource.completed;
        setSavingId(resource.id);

        // Optimistic state update
        setResources((prev) =>
            prev.map((item) =>
                item.id === resource.id
                    ? { ...item, completed: nextCompleted }
                    : item
            )
        );

        try {
            await interviewApi.setCompleted(resource.id, currentUser.email, nextCompleted);
        } catch (err) {
            console.error('Failed to update resource completion:', err);
            // Revert on error
            setResources((prev) =>
                prev.map((item) =>
                    item.id === resource.id
                        ? { ...item, completed: resource.completed }
                        : item
                )
            );
            setError('Failed to save progress');
        } finally {
            setSavingId(null);
        }
    };

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-5xl mx-auto">

                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl font-light text-foreground text-glow font-display">Interview Prep</h1>
                    <p className="text-muted-foreground mt-2">Resources to ace your interviews</p>
                    {error && (
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                            <p className="text-sm text-rose-400">{error}</p>
                            <button
                                type="button"
                                onClick={() => setRetryNonce((prev) => prev + 1)}
                                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-foreground/40"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </motion.header>

                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCat(c)}
                            className={`px-4 py-2 text-sm rounded-full transition-all border ${cat === c
                                ? 'bg-foreground text-background border-foreground shadow-glow font-medium'
                                : 'bg-muted text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-muted-foreground py-8">Loading resources...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
                        {filtered.map((r, i) => (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="glass-card p-6 rounded-2xl hover:bg-accent/50 transition-all border border-border hover:border-border/80"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-xs text-muted-foreground font-mono">{r.category}</span>
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${r.completed
                                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                                        : 'border-border text-muted-foreground bg-muted/50'
                                        }`}>
                                        {r.completed ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                                <h3 className="font-medium text-foreground mt-2">{r.title}</h3>
                                <p className="text-sm text-muted-foreground mt-2">{r.description}</p>
                                <div className="mt-4">
                                    <button
                                        onClick={() => toggleCompleted(r)}
                                        disabled={!currentUser?.email || savingId === r.id}
                                        className={`w-full px-3 py-2 text-xs rounded-xl border transition-all ${r.completed
                                            ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                                            : 'border-border text-foreground bg-muted hover:bg-accent'
                                            } disabled:opacity-60`}
                                    >
                                        {savingId === r.id ? 'Saving...' : (r.completed ? 'Mark Pending' : 'Mark Complete')}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="glass-panel p-8 rounded-3xl border border-border">
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6 opacity-50">Quick Tips</h2>
                    <div className="space-y-4">
                        {(tips.length ? tips : ['No tips available']).map((tip, i) => (
                            <motion.div
                                key={`${tip}-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                            >
                                <span className="text-xs text-muted-foreground font-mono pt-1">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <p className="text-foreground/80 text-sm leading-relaxed">{tip}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InterviewPrep;
