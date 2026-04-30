import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Flame } from 'lucide-react';
import useStore from '../store/useStore';
import { PageHeader, Surface, TintedSurface, KpiTile, HeroTile, Section } from '../components/ui/AppPrimitives';
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

    const maxWeekly = Math.max(...weeklyActivity, 1);
    const activeContributionDays = heatmapData.rows.filter((item) => (
        Number.parseInt(item?.problems_solved, 10) > 0
    )).length;
    const contributionData = useMemo(() => makeData(heatmapData.rows), [heatmapData.rows]);
    const avgWeeklyScore = Math.round(
        weeklyActivity.reduce((sum, item) => sum + (Number.parseInt(item, 10) || 0), 0) / Math.max(1, weeklyActivity.length)
    );

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const firstName = (profileData?.name || currentUser?.displayName || currentUser?.email || 'there').split(' ')[0].split('@')[0];

    return (
        <div className="px-5 sm:px-8 lg:px-14 py-8 lg:py-14 relative">
            <div className="max-w-[1200px] mx-auto">
                <PageHeader
                    eyebrow="Workspace"
                    title={`Welcome back, ${firstName}.`}
                    tail="Let's ship today."
                    meta={today}
                />

                {error && (
                    <Surface className="p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-[#9C2A1F]">{error}</p>
                            <button
                                type="button"
                                onClick={() => setRetryNonce((prev) => prev + 1)}
                                className="rounded-full bg-card border px-3 h-8 text-xs font-semibold text-foreground hover:border-foreground/15 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </Surface>
                )}

                {/* ── Hero tile (streak) + KPI strip — painterly fabric tones ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12">
                    <div className="lg:col-span-5">
                        <HeroTile
                            tone="sand"
                            eyebrow="Current streak"
                            value={loading ? '—' : `${streak}`}
                            label={streak === 1 ? 'day in a row' : 'days in a row'}
                            accent={streak >= 7 ? '— keep the fire alive.' : '— let\'s build it.'}
                            footnote={`Last solved · ${stats?.lastActivity || 'no record yet'}`}
                        />
                    </div>
                    <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <KpiTile
                            tone="sage"
                            label="Solved"
                            value={loading ? '—' : `${solved}`}
                            hint={`of ${total} problems`}
                        />
                        <KpiTile
                            tone="mist"
                            label="Studied"
                            value={loading ? '—' : `${hours}h`}
                            hint="logged total"
                        />
                        <KpiTile
                            tone="peach"
                            label="Completion"
                            value={loading ? '—' : `${completion}%`}
                            hint="overall progress"
                        />
                        <KpiTile
                            label="Active days"
                            value={loading ? '—' : `${activeContributionDays}`}
                            hint="last 365 days"
                        />
                        <KpiTile
                            label="Weekly avg"
                            value={loading ? '—' : `${avgWeeklyScore}`}
                            hint="problems / day"
                        />
                        <KpiTile
                            label="Focus left"
                            value={loading ? '—' : `${focus.focusProblems.length}`}
                            hint="in today's queue"
                        />
                    </div>
                </div>

                {/* ── Contribution heatmap — full width signature moment ── */}
                <Section
                    eyebrow="Last 365 days"
                    label="Contribution activity"
                    action={
                        <span className="text-[10.5px] text-muted-foreground font-mono tabular uppercase tracking-[0.12em]">
                            Live
                        </span>
                    }
                >
                    <Surface lift className="p-6 lg:p-7">
                        <HeatmapCalendar
                            title=""
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
                    </Surface>
                </Section>

                {/* ── Asymmetric split: queue + weekly + momentum ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Today's queue — primary focus, 7 cols */}
                    <Surface lift className="lg:col-span-7 p-6 lg:p-7">
                        <div className="flex items-baseline justify-between mb-6">
                            <div>
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 mb-1">
                                    Today
                                </p>
                                <h2 className="font-display font-semibold text-[20px] tracking-[-0.018em] text-foreground">
                                    Your queue
                                    <span className="italic-accent text-foreground/70"> — pick one and ship.</span>
                                </h2>
                            </div>
                            <span className="text-[11px] text-muted-foreground font-mono tabular">
                                {focus.focusProblems.length} left
                            </span>
                        </div>

                        {focusLoading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="h-10 rounded-md bg-secondary animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="divide-y" style={{ borderColor: 'hsl(var(--hair))' }}>
                                    {focus.focusProblems.length === 0 ? (
                                        <p className="text-[13.5px] text-muted-foreground py-4">
                                            All tracked problems are solved. <span className="italic-accent">Beautiful.</span>
                                        </p>
                                    ) : (
                                        focus.focusProblems.map((problem, idx) => (
                                            <button
                                                key={problem.id}
                                                type="button"
                                                onClick={() => navigate(`/app/dsa/${problem.sheetId}`)}
                                                className="w-full flex items-center justify-between py-3.5 group transition-all"
                                            >
                                                <div className="flex items-center gap-3 min-w-0 pr-3 text-left">
                                                    <span className="font-mono text-[10.5px] text-muted-foreground/55 w-5 tabular">
                                                        {String(idx + 1).padStart(2, '0')}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-[13.5px] text-foreground line-clamp-1 group-hover:text-[#0E334F] transition-colors">{problem.title}</p>
                                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                                            {problem.sheetName} · {problem.topicName}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ArrowUpRight className="w-4 h-4 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                                            </button>
                                        ))
                                    )}
                                </div>

                                {focus.issueRecommendation && (
                                    <div className="pt-5 mt-5 border-t" style={{ borderColor: 'hsl(var(--hair))' }}>
                                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#0E334F]/75 mb-2.5">
                                            Good first issue
                                        </p>
                                        <a
                                            href={focus.issueRecommendation.html_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-start justify-between gap-3 group"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-[13.5px] text-foreground line-clamp-2 group-hover:text-[#0E334F] transition-colors">
                                                    {focus.issueRecommendation.title}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                                                    {focus.issueRecommendation.repo_full_name}
                                                </p>
                                            </div>
                                            <ArrowUpRight className="w-4 h-4 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-0.5" />
                                        </a>
                                    </div>
                                )}
                            </>
                        )}
                    </Surface>

                    {/* Right rail — weekly bars + momentum/Pro */}
                    <div className="lg:col-span-5 flex flex-col gap-5">
                        <Surface lift className="p-6">
                            <div className="flex items-baseline justify-between mb-5">
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70">
                                    This week
                                </p>
                                <span className="text-[10.5px] text-muted-foreground font-mono tabular">7d</span>
                            </div>
                            <div className="grid grid-cols-7 gap-2 items-end h-24">
                                {WEEK_DAYS.map((day, index) => {
                                    const value = weeklyActivity[index] || 0;
                                    const todayDate = new Date();
                                    const todayIndex = todayDate.getDay() === 0 ? 6 : todayDate.getDay() - 1;
                                    const isToday = todayIndex === index;
                                    const barHeight = Math.max(8, Math.round((value / maxWeekly) * 100));

                                    return (
                                        <div key={`${day}-${index}`} className="flex flex-col items-center gap-2">
                                            <div className="w-full h-16 flex items-end">
                                                <div
                                                    className={`w-full rounded-sm transition-all ${
                                                        isToday ? 'bg-[#0E334F]' : 'bg-foreground/12'
                                                    }`}
                                                    style={{ height: `${barHeight}%` }}
                                                />
                                            </div>
                                            <span
                                                className={`text-[10px] font-mono tracking-[0.04em] ${
                                                    isToday ? 'text-[#0E334F] font-semibold' : 'text-muted-foreground'
                                                }`}
                                            >
                                                {day}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </Surface>

                        {isPro ? (
                            <Surface lift className="p-6">
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/70 mb-4">
                                    Momentum
                                </p>
                                <div className="divide-y" style={{ borderColor: 'hsl(var(--hair))' }}>
                                    <div className="py-3 flex items-baseline justify-between">
                                        <p className="text-[12.5px] text-muted-foreground">Active days</p>
                                        <p className="font-display font-semibold text-[18px] text-foreground tabular">{activeContributionDays}</p>
                                    </div>
                                    <div className="py-3 flex items-baseline justify-between">
                                        <p className="text-[12.5px] text-muted-foreground">Avg weekly score</p>
                                        <p className="font-display font-semibold text-[18px] text-foreground tabular">{avgWeeklyScore}</p>
                                    </div>
                                    <div className="py-3 flex items-baseline justify-between">
                                        <p className="text-[12.5px] text-muted-foreground">Focus complete</p>
                                        <p className="font-display font-semibold text-[18px] text-foreground tabular">
                                            {focus.focusProblems.length === 0 ? '100%' : `${Math.max(0, 100 - (focus.focusProblems.length * 25))}%`}
                                        </p>
                                    </div>
                                </div>
                            </Surface>
                        ) : (
                            <TintedSurface tone="peach" lift className="p-6">
                                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#7A4A1F]/80 mb-3">
                                    Pro
                                </p>
                                <p className="font-display font-semibold text-[19px] tracking-[-0.015em] text-[#3a2e2a] leading-snug">
                                    Deeper analytics,
                                    <span className="italic-accent"> unlimited AI suggestions</span>,
                                    priority OSS matches.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => navigate('/pricing')}
                                    className="mt-5 inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#3a2e2a] text-[#FAF8F2] text-[12px] font-semibold hover:opacity-90 transition-opacity"
                                >
                                    See Pro plan <ArrowUpRight className="w-3 h-3" />
                                </button>
                            </TintedSurface>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
