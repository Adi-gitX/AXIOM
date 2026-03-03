import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Target, BellOff, Bell, ArrowUpRight } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../contexts/AuthContext';
import { gsocApi } from '../lib/api';

const GsocAccelerator = () => {
    const { currentUser } = useAuth();

    const [timeline, setTimeline] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [readiness, setReadiness] = useState(null);
    const [reminders, setReminders] = useState({ active: [], dismissed: [], urgency: { today: 0, threeDay: 0, sevenDay: 0 } });
    const [filters, setFilters] = useState({ q: '', difficulty: '', language: '', domain: '' });
    const [showDismissedReminders, setShowDismissedReminders] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryNonce, setRetryNonce] = useState(0);
    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );
    const hasSnapshotRef = useRef(false);

    const email = currentUser?.email || '';

    useEffect(() => {
        hasSnapshotRef.current = timeline.length > 0 || orgs.length > 0 || Boolean(readiness);
    }, [timeline.length, orgs.length, readiness]);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [timelineData, orgData, readinessData, reminderData] = await Promise.all([
                gsocApi.getTimeline(),
                gsocApi.getOrgs(filters),
                email ? gsocApi.getReadiness(email) : Promise.resolve(null),
                email ? gsocApi.getReminders(email, true) : Promise.resolve({ active: [], dismissed: [], urgency: { today: 0, threeDay: 0, sevenDay: 0 } }),
            ]);

            setTimeline(Array.isArray(timelineData?.timeline) ? timelineData.timeline : []);
            setOrgs(Array.isArray(orgData?.organizations) ? orgData.organizations : []);
            setReadiness(readinessData);
            setReminders({
                active: Array.isArray(reminderData?.active) ? reminderData.active : [],
                dismissed: Array.isArray(reminderData?.dismissed) ? reminderData.dismissed : [],
                urgency: reminderData?.urgency || { today: 0, threeDay: 0, sevenDay: 0 },
            });
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to load GSOC data:', err);
            }
            const hasSnapshot = hasSnapshotRef.current;
            setError(
                hasSnapshot
                    ? 'Live GSOC refresh is limited right now. Showing last synced data.'
                    : 'Failed to load GSOC accelerator data.'
            );
        } finally {
            setLoading(false);
        }
    }, [email, filters]);

    useEffect(() => {
        load();
    }, [load, retryNonce]);

    const dismissReminder = async (milestoneId) => {
        if (!email) return;
        try {
            await gsocApi.dismissReminder(email, milestoneId);
            await load();
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to dismiss reminder:', err);
            }
            setError(err?.message || 'Failed to dismiss reminder.');
        }
    };

    const restoreReminder = async (milestoneId) => {
        if (!email) return;
        try {
            await gsocApi.restoreReminder(email, milestoneId);
            await load();
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to restore reminder:', err);
            }
            setError(err?.message || 'Failed to restore reminder.');
        }
    };

    const uniqueLanguages = useMemo(() => {
        const set = new Set();
        for (const org of orgs) {
            for (const language of org.languages || []) set.add(language);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [orgs]);

    const visibleReminders = showDismissedReminders
        ? reminders.dismissed
        : reminders.active;

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <h1 className="text-5xl font-light text-foreground font-display tracking-tight">GSOC Accelerator</h1>
                    <p className="text-muted-foreground text-lg font-light">
                        Timeline, reminders, target organizations, and a practical readiness score for GSOC 2026.
                    </p>
                </motion.header>

                {error && (
                    <GlassCard className="p-4" hoverEffect={false}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-rose-500">{error}</p>
                            <button
                                type="button"
                                onClick={() => setRetryNonce((prev) => prev + 1)}
                                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-foreground/40"
                            >
                                Retry
                            </button>
                        </div>
                    </GlassCard>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <GlassCard className="p-5 lg:col-span-2" hoverEffect={false}>
                        <div className="flex items-center gap-2 mb-3">
                            <CalendarClock className="w-4 h-4 text-foreground" />
                            <p className="text-sm font-semibold text-foreground">GSOC 2026 Timeline</p>
                        </div>

                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading timeline...</p>
                        ) : (
                            <div className="space-y-2">
                                {timeline.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-xl border border-border bg-background/40 px-3 py-2"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-sm font-medium text-foreground">{item.title}</p>
                                            <span className="text-[11px] text-muted-foreground font-mono">{item.date}</span>
                                        </div>
                                        <p className="text-[11px] text-muted-foreground mt-1">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassCard>

                    <GlassCard className="p-5" hoverEffect={false}>
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-foreground" />
                            <p className="text-sm font-semibold text-foreground">Readiness Score</p>
                        </div>

                        {!email ? (
                            <p className="text-sm text-muted-foreground">Sign in to see personalized readiness.</p>
                        ) : loading ? (
                            <p className="text-sm text-muted-foreground">Calculating...</p>
                        ) : (
                            <>
                                <p className="text-4xl font-light text-foreground">{readiness?.readinessScore ?? 0}</p>
                                <p className="text-xs text-muted-foreground mt-1">{readiness?.readinessBand || 'Early Stage'}</p>
                                <div className="h-2 rounded-full bg-foreground/10 overflow-hidden mt-3">
                                    <div
                                        className="h-full rounded-full bg-foreground"
                                        style={{ width: `${readiness?.readinessScore ?? 0}%` }}
                                    />
                                </div>
                                <div className="mt-3 text-xs text-muted-foreground space-y-1">
                                    <p>DSA: {readiness?.metrics?.dsaCompletion ?? 0}%</p>
                                    <p>Merged PRs: {readiness?.metrics?.prsMerged ?? 0}</p>
                                    <p>Opened PRs: {readiness?.metrics?.prsOpened ?? 0}</p>
                                </div>
                            </>
                        )}
                    </GlassCard>
                </div>

                <GlassCard className="p-5" hoverEffect={false}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-sm font-semibold text-foreground">Automatic Reminders</p>
                        <span className="text-xs text-muted-foreground font-mono">{reminders.active.length} active</span>
                    </div>

                    {!email ? (
                        <p className="text-sm text-muted-foreground">Sign in to manage reminder state.</p>
                    ) : (
                        <>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div className="inline-flex rounded-xl border border-border bg-background/50 p-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowDismissedReminders(false)}
                                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${!showDismissedReminders
                                            ? 'bg-foreground text-background'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Active ({reminders.active.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDismissedReminders(true)}
                                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${showDismissedReminders
                                            ? 'bg-foreground text-background'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Dismissed ({reminders.dismissed.length})
                                    </button>
                                </div>

                                {!showDismissedReminders && (
                                    <div className="text-[11px] text-muted-foreground flex items-center gap-3">
                                        <span>Today: {reminders.urgency.today || 0}</span>
                                        <span>3-day: {reminders.urgency.threeDay || 0}</span>
                                        <span>7-day: {reminders.urgency.sevenDay || 0}</span>
                                    </div>
                                )}
                            </div>

                            {visibleReminders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {showDismissedReminders
                                        ? 'No dismissed reminders yet.'
                                        : 'All reminders dismissed.'}
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {visibleReminders.map((item) => (
                                        <div key={item.id} className="rounded-xl border border-border bg-background/40 px-3 py-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-medium text-foreground">{item.title}</p>
                                                {item.dismissed ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => restoreReminder(item.id)}
                                                        className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                                                    >
                                                        <Bell className="w-3 h-3" /> Restore
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => dismissReminder(item.id)}
                                                        className="text-[11px] font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                                                    >
                                                        <BellOff className="w-3 h-3" /> Dismiss
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                {item.date} • {item.status}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </GlassCard>

                <GlassCard className="p-5" hoverEffect={false}>
                    <p className="text-sm font-semibold text-foreground mb-3">Beginner-Friendly Organizations</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                        <input
                            type="text"
                            value={filters.q}
                            onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
                            placeholder="Search org or tag"
                            className="md:col-span-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        />
                        <select
                            value={filters.difficulty}
                            onChange={(event) => setFilters((prev) => ({ ...prev, difficulty: event.target.value }))}
                            className="rounded-xl border border-border bg-background/60 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        >
                            <option value="">All difficulties</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        <select
                            value={filters.language}
                            onChange={(event) => setFilters((prev) => ({ ...prev, language: event.target.value }))}
                            className="rounded-xl border border-border bg-background/60 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        >
                            <option value="">All languages</option>
                            {uniqueLanguages.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading organizations...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {orgs.map((org) => (
                                <div key={org.id} className="rounded-xl border border-border bg-background/40 px-3 py-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-semibold text-foreground">{org.name}</p>
                                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground uppercase tracking-wider">
                                            {org.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mt-1">{org.domain}</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">{(org.languages || []).join(', ')}</p>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {(org.tags || []).slice(0, 3).map((tag) => (
                                            <span key={`${org.id}-${tag}`} className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={org.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline"
                                    >
                                        Visit org <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
};

export default GsocAccelerator;
