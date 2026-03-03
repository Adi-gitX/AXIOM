import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { jobsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';

const Jobs = () => {
    const { currentUser } = useAuth();
    const [filter, setFilter] = useState('All');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [error, setError] = useState('');
    const [retryNonce, setRetryNonce] = useState(0);
    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );

    const filters = ['All', 'Remote', 'Full-time', 'Contract', 'Internship'];

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError('');
            try {
                const params = {};
                if (filter === 'Remote') params.remote = 'true';
                else if (filter !== 'All') params.type = filter;
                if (currentUser?.email) params.email = currentUser.email;

                const data = await jobsApi.getAll(params);
                const jobsList = data.jobs || [];
                setJobs(jobsList);
                setSavedJobIds(jobsList.filter((job) => job.is_saved).map((job) => job.id));
                setAppliedJobIds(jobsList.filter((job) => job.is_applied).map((job) => job.id));
            } catch (err) {
                if (!isTransientApiError(err)) {
                    console.error('Failed to fetch jobs:', err);
                }
                // Fallback to empty list on error
                setJobs([]);
                setSavedJobIds([]);
                setAppliedJobIds([]);
                setError('Unable to refresh jobs right now.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [filter, currentUser?.email, retryNonce]);

    // Handle save job toggle
    const handleSaveJob = async (jobId) => {
        // Optimistic update
        const wasSaved = savedJobIds.includes(jobId);
        setSavedJobIds(prev =>
            wasSaved ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );

        if (currentUser?.email) {
            try {
                if (wasSaved) {
                    await jobsApi.unsave(currentUser.email, jobId);
                } else {
                    await jobsApi.save(currentUser.email, jobId);
                }
            } catch (err) {
                console.error('Failed to save/unsave job:', err);
                // Revert on error
                setSavedJobIds(prev =>
                    wasSaved ? [...prev, jobId] : prev.filter(id => id !== jobId)
                );
            }
        }
    };

    const isJobSaved = (jobId) => savedJobIds.includes(jobId);
    const isJobApplied = (jobId) => appliedJobIds.includes(jobId);

    const handleApplyJob = async (job) => {
        const alreadyApplied = isJobApplied(job.id);
        if (alreadyApplied) return;

        setAppliedJobIds(prev => [...prev, job.id]);

        if (currentUser?.email) {
            try {
                await jobsApi.apply(currentUser.email, job.id, null);
            } catch (err) {
                console.error('Failed to track job application:', err);
                setAppliedJobIds(prev => prev.filter(id => id !== job.id));
            }
        }

        if (job.apply_url) {
            window.open(job.apply_url, '_blank', 'noopener,noreferrer');
        }
    };

    // Format posted date
    const formatPosted = (date) => {
        if (!date) return 'N/A';
        if (typeof date === 'string' && date.includes('ago')) return date;

        const posted = new Date(date);
        const now = new Date();
        const diff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));

        if (diff === 0) return 'Today';
        if (diff === 1) return '1d ago';
        if (diff < 7) return `${diff}d ago`;
        if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
        return `${Math.floor(diff / 30)}mo ago`;
    };

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl font-light text-foreground font-display tracking-tight">Jobs</h1>
                    <p className="text-muted-foreground text-lg font-light mt-2">Find your next opportunity</p>
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

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setLoading(true); }}
                            className={`px-4 py-2 text-sm rounded-full transition-all border ${filter === f
                                ? 'bg-foreground text-background border-foreground font-medium'
                                : 'bg-muted text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Jobs List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading jobs...</p>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /></svg>
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">No opportunities yet</h3>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">New positions are posted regularly. Check back soon for the latest openings.</p>
                        </div>
                    ) : (
                        jobs.map((job, i) => {
                            const saved = isJobSaved(job.id);
                            return (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <GlassCard hoverEffect={true} className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-foreground">{job.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                                                <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground font-mono">
                                                    <span className="bg-muted px-2 py-1 rounded border border-border">
                                                        {job.is_remote ? 'Remote' : job.location}
                                                    </span>
                                                    <span>{job.salary}</span>
                                                    <span>{formatPosted(job.posted_at)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleApplyJob(job)}
                                                    disabled={isJobApplied(job.id)}
                                                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${isJobApplied(job.id)
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                                                        : 'bg-muted text-foreground hover:bg-accent border border-border'
                                                        }`}
                                                >
                                                    {isJobApplied(job.id) ? 'Applied' : 'Apply'}
                                                </button>
                                                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
                                                    {job.job_type}
                                                </span>
                                                <button
                                                    onClick={() => handleSaveJob(job.id)}
                                                    className={`p-2 rounded-xl transition-all ${saved
                                                        ? 'bg-foreground text-background hover:opacity-90'
                                                        : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-accent'
                                                        }`}
                                                >
                                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                                                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
};

export default Jobs;
