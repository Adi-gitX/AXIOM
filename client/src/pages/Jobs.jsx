import React, { useState, useEffect, useMemo } from 'react';
import { Briefcase, MapPin, Bookmark, ExternalLink, Building2 } from 'lucide-react';
import { jobsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { PageHeader, Surface, EmptyState, Kicker } from '../components/ui/AppPrimitives';

const isTransient = (err) => err?.status === 401 || err?.status === 429 || err?.status === 503 || err?.code === 'BACKEND_UNAVAILABLE';

const formatPosted = (date) => {
    if (!date) return 'New';
    if (typeof date === 'string' && date.includes('ago')) return date;
    const posted = new Date(date);
    const diff = Math.floor((new Date() - posted) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return '1d ago';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
};

const Jobs = () => {
    const { currentUser } = useAuth();
    const [filter, setFilter] = useState('All');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedJobIds, setSavedJobIds] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState([]);
    const [error, setError] = useState('');
    const [retryNonce, setRetryNonce] = useState(0);
    const [liveMode, setLiveMode] = useState(true); // default: real RemoteOK + Arbeitnow data

    const filters = ['All', 'Remote', 'Full-time', 'Contract', 'Internship'];

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError('');
            try {
                if (liveMode) {
                    const apiBase = (import.meta.env.VITE_API_URL || '') + '/api/public/jobs';
                    const r = await fetch(apiBase);
                    if (!r.ok) throw new Error(`live jobs ${r.status}`);
                    const data = await r.json();
                    const list = (data.jobs || []).filter((j) => {
                        if (filter === 'All') return true;
                        if (filter === 'Remote') return j.is_remote === 1;
                        return j.job_type === filter;
                    });
                    setJobs(list);
                    setSavedJobIds([]);
                    setAppliedJobIds([]);
                } else {
                    const params = {};
                    if (filter === 'Remote') params.remote = 'true';
                    else if (filter !== 'All') params.type = filter;
                    if (currentUser?.email) params.email = currentUser.email;
                    const data = await jobsApi.getAll(params);
                    const list = data.jobs || [];
                    setJobs(list);
                    setSavedJobIds(list.filter((j) => j.is_saved).map((j) => j.id));
                    setAppliedJobIds(list.filter((j) => j.is_applied).map((j) => j.id));
                }
            } catch (err) {
                if (!isTransient(err)) console.error('Failed to fetch jobs:', err);
                setJobs([]); setSavedJobIds([]); setAppliedJobIds([]);
                setError('Unable to refresh jobs right now.');
            } finally { setLoading(false); }
        };
        fetchJobs();
    }, [filter, currentUser?.email, retryNonce, liveMode]);

    const filterCounts = useMemo(() => ({
        All: jobs.length,
        Remote: jobs.filter((j) => j.is_remote).length,
        'Full-time': jobs.filter((j) => j.job_type === 'Full-time').length,
        Contract: jobs.filter((j) => j.job_type === 'Contract').length,
        Internship: jobs.filter((j) => j.job_type === 'Internship').length,
    }), [jobs]);

    const handleSaveJob = async (jobId) => {
        const wasSaved = savedJobIds.includes(jobId);
        setSavedJobIds((prev) => wasSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]);
        if (currentUser?.email) {
            try {
                if (wasSaved) await jobsApi.unsave(currentUser.email, jobId);
                else await jobsApi.save(currentUser.email, jobId);
            } catch (err) {
                console.error(err);
                setSavedJobIds((prev) => wasSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId));
            }
        }
    };

    const handleApplyJob = async (job) => {
        if (appliedJobIds.includes(job.id)) {
            if (job.apply_url) window.open(job.apply_url, '_blank', 'noopener,noreferrer');
            return;
        }
        setAppliedJobIds((prev) => [...prev, job.id]);
        if (currentUser?.email) {
            try { await jobsApi.apply(currentUser.email, job.id, null); }
            catch (err) {
                console.error(err);
                setAppliedJobIds((prev) => prev.filter((id) => id !== job.id));
            }
        }
        if (job.apply_url) window.open(job.apply_url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="px-5 sm:px-8 lg:px-14 py-8 lg:py-16">
            <div className="mx-auto max-w-[1280px]">
                <PageHeader
                    eyebrow="Career"
                    title="Jobs"
                    tail={liveMode ? '— live from RemoteOK + Arbeitnow.' : '— curated picks.'}
                    meta={`${jobs.length} opportunities · ${liveMode ? 'refreshed every 30 min' : 'curated daily'}`}
                    action={
                        <div className="inline-flex items-center gap-1 bg-card border rounded-full p-1" style={{ borderColor: 'hsl(var(--hair))' }}>
                            <button
                                data-testid="jobs-mode-live"
                                onClick={() => setLiveMode(true)}
                                className={`h-7 px-3 rounded-full text-[12px] font-semibold transition-colors ${liveMode ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <span className={`inline-block w-1.5 h-1.5 rounded-full bg-[#0E334F] mr-2 align-middle ${liveMode ? 'live-dot' : ''}`} /> Live
                            </button>
                            <button
                                data-testid="jobs-mode-curated"
                                onClick={() => setLiveMode(false)}
                                className={`h-7 px-3 rounded-full text-[12px] font-semibold transition-colors ${!liveMode ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Curated
                            </button>
                        </div>
                    }
                />

                {error && (
                    <Surface className="p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-[#9C2A1F]">{error}</p>
                            <button
                                onClick={() => setRetryNonce((p) => p + 1)}
                                className="rounded-full px-4 h-8 bg-foreground text-background text-[12px] font-semibold hover:opacity-90"
                            >
                                Retry
                            </button>
                        </div>
                    </Surface>
                )}

                {/* Filter chips with counts */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {filters.map((f) => {
                        const isActive = filter === f;
                        return (
                            <button
                                key={f}
                                data-testid={`jobs-filter-${f.toLowerCase()}`}
                                onClick={() => setFilter(f)}
                                className={`inline-flex items-center gap-2 h-8 px-3.5 rounded-full text-[13px] font-semibold border transition-colors ${
                                    isActive
                                        ? 'bg-foreground text-background border-foreground'
                                        : 'bg-card text-muted-foreground hover:text-foreground'
                                }`}
                                style={!isActive ? { borderColor: 'hsl(var(--hair))' } : {}}
                            >
                                {f}
                                <span className={`text-[11px] font-mono tabular ${isActive ? 'text-background/60' : 'text-muted-foreground/70'}`}>
                                    {filterCounts[f] || 0}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* List */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Surface key={i} className="p-6">
                                <div className="h-5 w-1/2 bg-secondary rounded animate-pulse mb-3" />
                                <div className="h-3 w-1/3 bg-secondary rounded animate-pulse" />
                            </Surface>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <EmptyState
                        title="No opportunities right now"
                        description="New positions are posted daily. Check back soon, or browse a different filter."
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {jobs.map((job, i) => {
                            const saved = savedJobIds.includes(job.id);
                            const applied = appliedJobIds.includes(job.id);
                            return (
                                <div key={job.id}>
                                    <Surface className="p-5 group hover:border-foreground/15 transition-colors">
                                        <div className="flex items-start gap-4">
                                            {/* Company avatar */}
                                            <div
                                                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-display font-semibold text-[15px] text-foreground tracking-tight"
                                                style={{ backgroundColor: 'hsl(var(--paper-soft))' }}
                                            >
                                                {(job.company || '?').slice(0, 1).toUpperCase()}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h3 className="font-display font-semibold text-[16.5px] tracking-[-0.012em] text-foreground truncate">
                                                            {job.title}
                                                        </h3>
                                                        <p className="text-[13px] text-muted-foreground mt-0.5 inline-flex items-center gap-1.5">
                                                            <Building2 className="w-3.5 h-3.5" />
                                                            {job.company}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full bg-secondary text-[10.5px] font-mono uppercase tracking-[0.08em] text-muted-foreground border shrink-0"
                                                        style={{ borderColor: 'hsl(var(--hair))' }}
                                                    >
                                                        {job.job_type || 'Full-time'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[12px] text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {job.is_remote ? 'Remote' : (job.location || '—')}
                                                    </span>
                                                    {job.salary && <span className="font-mono">{job.salary}</span>}
                                                    <span className="font-mono">· {formatPosted(job.posted_at)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button
                                                    onClick={() => handleSaveJob(job.id)}
                                                    data-testid={`job-save-${job.id}`}
                                                    className={`w-9 h-9 inline-flex items-center justify-center rounded-full border transition-colors ${
                                                        saved
                                                            ? 'bg-foreground text-background border-foreground'
                                                            : 'bg-card text-muted-foreground hover:text-foreground'
                                                    }`}
                                                    style={!saved ? { borderColor: 'hsl(var(--hair))' } : {}}
                                                    title={saved ? 'Saved' : 'Save job'}
                                                >
                                                    <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} strokeWidth={1.7} />
                                                </button>
                                                <button
                                                    onClick={() => handleApplyJob(job)}
                                                    data-testid={`job-apply-${job.id}`}
                                                    className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[12.5px] font-semibold transition-colors border ${
                                                        applied
                                                            ? 'bg-secondary text-foreground'
                                                            : 'bg-foreground text-background border-foreground hover:opacity-90'
                                                    }`}
                                                    style={applied ? { borderColor: 'hsl(var(--hair))' } : {}}
                                                >
                                                    {applied ? 'Applied' : 'Apply'}
                                                    <ExternalLink className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </Surface>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
