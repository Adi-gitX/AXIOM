import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flame, Target, ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import GlassCard from '../components/ui/GlassCard';
import PremiumBadge from '../components/ui/PremiumBadge';
import { progressApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../stores/useUserStore';
import { HeatmapCalendar } from "@/components/heatmap-calendar";

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function makeData(rows = []) {
    return (rows || [])
        .map((row) => {
            const rawDate = row?.activity_date ?? row?.date ?? '';
            const date = String(rawDate).slice(0, 10);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                return null;
            }

            const rawValue = row?.problems_solved ?? row?.value ?? 0;
            return {
                date,
                value: Number.parseInt(rawValue, 10) || 0,
            };
        })
        .filter(Boolean);
}

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { solvedProblems, dsaMutationVersion } = useStore();
    const { user: profileData, fetchProfile } = useUserStore();
    const isPro = Boolean(profileData?.is_pro);

    const [stats, setStats] = useState(null);
    const [weeklyActivity, setWeeklyActivity] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [focus, setFocus] = useState({ focusProblems: [], issueRecommendation: null });
    const [heatmapData, setHeatmapData] = useState({ rows: [], timezone: 'UTC', from: null, to: null });
    const [loading, setLoading] = useState(true);
    const [focusLoading, setFocusLoading] = useState(true);
    const [error, setError] = useState('');
    const [retryNonce, setRetryNonce] = useState(0);
    const hasStaleSnapshotRef = useRef(false);
    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );

    useEffect(() => {
        if (currentUser?.email) {
            fetchProfile(currentUser.email);
        }
    }, [currentUser?.email, fetchProfile]);

    useEffect(() => {
        hasStaleSnapshotRef.current = Boolean(
            stats
            || (Array.isArray(heatmapData.rows) && heatmapData.rows.length > 0)
            || (Array.isArray(focus.focusProblems) && focus.focusProblems.length > 0)
            || focus.issueRecommendation
            || weeklyActivity.some((value) => Number.parseInt(value, 10) > 0)
        );
    }, [stats, heatmapData.rows, focus, weeklyActivity]);

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!currentUser?.email) {
                setLoading(false);
                setFocusLoading(false);
                return;
            }

            setLoading(true);
            setFocusLoading(true);
            setError('');
            const hasStaleSnapshot = hasStaleSnapshotRef.current;

            try {
                const [dashboardData, heatmap, focusData] = await Promise.all([
                    progressApi.getDashboardStats(currentUser.email),
                    progressApi.getHeatmap(currentUser.email, 365),
                    progressApi.getDailyFocus(currentUser.email, isPro ? 25 : 3),
                ]);

                setStats(dashboardData);
                setWeeklyActivity(Array.isArray(dashboardData?.weeklyActivity)
                    ? dashboardData.weeklyActivity
                    : [0, 0, 0, 0, 0, 0, 0]);
                setHeatmapData({
                    rows: Array.isArray(heatmap?.rows) ? heatmap.rows : [],
                    timezone: heatmap?.timezone || 'UTC',
                    from: heatmap?.from || null,
                    to: heatmap?.to || null,
                });
                setFocus({
                    focusProblems: Array.isArray(focusData?.focusProblems) ? focusData.focusProblems : [],
                    issueRecommendation: focusData?.issueRecommendation || null,
                });
            } catch (err) {
                if (!isTransientApiError(err)) {
                    console.error('Failed to fetch dashboard data:', err);
                }
                setError(
                    hasStaleSnapshot
                        ? 'Live refresh is limited right now. Showing the last synced dashboard snapshot.'
                        : 'Unable to load dashboard details right now.'
                );
                if (!hasStaleSnapshot) {
                    setStats(null);
                    setWeeklyActivity([0, 0, 0, 0, 0, 0, 0]);
                    setHeatmapData({ rows: [], timezone: 'UTC', from: null, to: null });
                    setFocus({ focusProblems: [], issueRecommendation: null });
                }
            } finally {
                setLoading(false);
                setFocusLoading(false);
            }
        };

        fetchDashboard();
    }, [currentUser?.email, dsaMutationVersion, isPro, retryNonce]);

    const solved = stats?.problemsSolved ?? solvedProblems.length;
    const total = stats?.totalProblems ?? 1096;
    const completion = stats?.completionPercentage ?? (total > 0 ? Math.round((solved / total) * 100) : 0);
    const streak = stats?.dayStreak ?? 0;
    const hours = stats?.hoursStudied ?? 0;

    const statCards = useMemo(() => ([
        {
            label: 'Problems Solved',
            value: `${solved}/${total}`,
            hint: 'Across all DSA sheets',
        },
        {
            label: 'Day Streak',
            value: `${streak}`,
            hint: streak > 0 ? 'Consistency in motion' : 'Start today',
        },
        {
            label: 'Hours Studied',
            value: `${hours}`,
            hint: 'Tracked study time',
        },
        {
            label: 'Overall Completion',
            value: `${completion}%`,
            hint: 'Total DSA progress',
        },
    ]), [solved, total, streak, hours, completion]);

    const maxWeekly = Math.max(...weeklyActivity, 1);
    const activeContributionDays = heatmapData.rows.filter((item) => (
        Number.parseInt(item?.problems_solved, 10) > 0
    )).length;
    const contributionData = useMemo(() => makeData(heatmapData.rows), [heatmapData.rows]);
    const avgWeeklyScore = Math.round(
        weeklyActivity.reduce((sum, item) => sum + (Number.parseInt(item, 10) || 0), 0) / Math.max(1, weeklyActivity.length)
    );

    const quickLinks = [
        { name: 'DSA Tracker', path: '/app/dsa', desc: 'Sheets + review queue' },
        { name: 'OSS Engine', path: '/app/oss', desc: 'PRs and good first issues' },
        { name: 'GSOC Accelerator', path: '/app/gsoc', desc: 'Timeline + readiness' },
        { name: 'Education Hub', path: '/app/education', desc: 'Topic-based learning' },
        { name: 'Interview Prep', path: '/app/interview', desc: 'Behavioral + coding' },
        { name: 'Dev Connect', path: '/app/connect', desc: 'Community channels' },
        { name: 'Jobs', path: '/app/jobs', desc: 'Opportunities' },
        { name: 'Profile', path: '/app/profile', desc: 'Portfolio + ATS score' },
    ];

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <CalendarDays className="w-4 h-4" />
                        <p className="text-xs uppercase tracking-[0.2em]">Daily Command Center</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <PremiumBadge tone="subtle">Premium Overview</PremiumBadge>
                        <PremiumBadge tone="accent">Live Momentum</PremiumBadge>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="text-5xl font-light text-foreground font-display tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground text-lg font-light mt-1">
                                Execution view for DSA, OSS, and GSOC momentum.
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 bg-background/40">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm font-semibold text-foreground">{streak} day streak</span>
                        </div>
                    </div>
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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, index) => (
                        <GlassCard
                            key={card.label}
                            className="p-5"
                            hoverEffect={false}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                        >
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">{card.label}</p>
                            <p className="text-2xl lg:text-3xl font-light text-foreground mt-2">{loading ? '...' : card.value}</p>
                            <p className="text-xs text-muted-foreground mt-1">{card.hint}</p>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <HeatmapCalendar
                            title="Contribution Activity (Last 365 days)"
                            data={contributionData}
                            weekStartsOn={1}
                            interactionMode="hover"
                            valueLabel={{ singular: 'question solved', plural: 'questions solved' }}
                            legend={{ placement: 'bottom' }}
                            axisLabels={{
                                showMonths: true,
                                showWeekdays: true,
                                weekdayIndices: [1, 3, 5],
                                monthFormat: "short",
                                minWeekSpacing: 3,
                            }}
                            loading={loading}
                            timezone={heatmapData.timezone}
                            from={heatmapData.from}
                            to={heatmapData.to}
                        />
                    </div>

                    <GlassCard className="p-5 space-y-4" hoverEffect={false}>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-foreground" />
                            <p className="text-sm font-semibold text-foreground">Daily Focus</p>
                        </div>

                        {focusLoading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="h-10 rounded-xl bg-foreground/10 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    {focus.focusProblems.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">All tracked problems are solved. Time to review and teach.</p>
                                    ) : (
                                        focus.focusProblems.map((problem) => (
                                            <button
                                                key={problem.id}
                                                type="button"
                                                onClick={() => navigate(`/app/dsa/${problem.sheetId}`)}
                                                className="w-full text-left rounded-xl border border-border bg-background/40 px-3 py-2 hover:border-foreground/30 transition-colors"
                                            >
                                                <p className="text-sm font-medium text-foreground line-clamp-1">{problem.title}</p>
                                                <p className="text-[11px] text-muted-foreground mt-1">
                                                    {problem.sheetName} • {problem.topicName}
                                                </p>
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="pt-2 border-t border-border/70 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-foreground" />
                                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Good First Issue</p>
                                    </div>
                                    {focus.issueRecommendation ? (
                                        <a
                                            href={focus.issueRecommendation.html_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block rounded-xl border border-border bg-background/40 px-3 py-2 hover:border-foreground/30 transition-colors"
                                        >
                                            <p className="text-sm font-medium text-foreground line-clamp-2">{focus.issueRecommendation.title}</p>
                                            <p className="text-[11px] text-muted-foreground mt-1">
                                                {focus.issueRecommendation.repo_full_name}
                                            </p>
                                        </a>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Connect GitHub in OSS Engine to unlock issue matching.</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/app/oss')}
                                        className="text-xs font-semibold text-foreground inline-flex items-center gap-1 hover:underline"
                                    >
                                        Open OSS Engine <ArrowUpRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </>
                        )}
                    </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <GlassCard className="p-5 lg:col-span-2" hoverEffect={false} premium>
                        <p className="text-sm font-semibold text-foreground">Weekly Activity</p>
                        <p className="text-xs text-muted-foreground mt-1">Composite score from DSA solves, study sessions, and education progress.</p>
                        <div className="mt-4 grid grid-cols-7 gap-3 items-end h-36">
                            {WEEK_DAYS.map((day, index) => {
                                const value = weeklyActivity[index] || 0;
                                const today = new Date();
                                const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
                                const isToday = todayIndex === index;
                                const barHeight = Math.max(10, Math.round((value / maxWeekly) * 100));

                                return (
                                    <div key={`${day}-${index}`} className="flex flex-col items-center gap-2">
                                        <div className="w-full h-24 flex items-end">
                                            <div
                                                className={`w-full rounded-lg ${isToday ? 'bg-foreground' : 'bg-foreground/20'}`}
                                                style={{ height: `${barHeight}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-mono ${isToday ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5" hoverEffect={false} premium>
                        <p className="text-sm font-semibold text-foreground">Advanced Analytics</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {isPro
                                ? 'Pro-only momentum diagnostics'
                                : 'Available on Pro plan'}
                        </p>

                        {isPro ? (
                            <div className="mt-4 space-y-3">
                                <div className="rounded-xl border border-border bg-background/40 px-3 py-2">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Active Contribution Days</p>
                                    <p className="text-lg font-semibold text-foreground mt-1">{activeContributionDays}</p>
                                </div>
                                <div className="rounded-xl border border-border bg-background/40 px-3 py-2">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Average Weekly Score</p>
                                    <p className="text-lg font-semibold text-foreground mt-1">{avgWeeklyScore}</p>
                                </div>
                                <div className="rounded-xl border border-border bg-background/40 px-3 py-2">
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Focus Completion</p>
                                    <p className="text-lg font-semibold text-foreground mt-1">
                                        {focus.focusProblems.length === 0 ? '100%' : `${Math.max(0, 100 - (focus.focusProblems.length * 25))}%`}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-4 rounded-xl border border-border bg-background/40 px-3 py-3">
                                <p className="text-sm text-muted-foreground">
                                    Upgrade to Pro to unlock deeper analytics panels and unlimited AI suggestions.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/pricing')}
                                    className="mt-3 text-xs font-semibold text-foreground hover:underline"
                                >
                                    View Pro plan
                                </button>
                            </div>
                        )}
                    </GlassCard>
                </div>

                <GlassCard className="p-5" hoverEffect={false}>
                    <p className="text-sm font-semibold text-foreground">Quick Access</p>
                    <p className="text-xs text-muted-foreground mt-1">Jump to any workspace module.</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                        {quickLinks.map((link) => (
                            <button
                                key={link.path}
                                type="button"
                                onClick={() => navigate(link.path)}
                                className="text-left rounded-xl border border-border bg-background/40 px-3 py-2 hover:border-foreground/30 transition-colors"
                            >
                                <p className="text-sm font-medium text-foreground">{link.name}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{link.desc}</p>
                            </button>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Dashboard;
