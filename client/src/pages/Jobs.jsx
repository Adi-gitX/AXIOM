import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { jobsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';

const Jobs = () => {
    const { currentUser } = useAuth();
    const { savedJobs, saveJob } = useStore();
    const [filter, setFilter] = useState('All');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedJobIds, setSavedJobIds] = useState([]);

    const filters = ['All', 'Remote', 'Full-time', 'Contract', 'Internship'];

    // Fetch jobs from API
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const params = {};
                if (filter === 'Remote') params.remote = 'true';
                else if (filter !== 'All') params.type = filter;

                const data = await jobsApi.getAll(params);
                setJobs(data.jobs || []);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
                // Fallback to empty list on error
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        // Fetch saved job IDs
        const fetchSavedIds = async () => {
            if (currentUser?.email) {
                try {
                    const ids = await jobsApi.getSavedIds(currentUser.email);
                    setSavedJobIds(ids);
                } catch (err) {
                    console.error('Failed to fetch saved job IDs:', err);
                }
            }
        };

        fetchJobs();
        fetchSavedIds();
    }, [filter, currentUser?.email]);

    // Handle save job toggle
    const handleSaveJob = async (jobId) => {
        // Optimistic update
        const wasSaved = savedJobIds.includes(jobId);
        setSavedJobIds(prev =>
            wasSaved ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );
        saveJob(jobId); // Also update local store

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

    // Combine local and server saved jobs
    const isJobSaved = (jobId) => savedJobIds.includes(jobId) || savedJobs.includes(jobId);

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
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No jobs found. Check back later!</p>
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
