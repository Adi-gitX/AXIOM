import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import DsaSheetCards from '../components/dsa/DsaSheetCards';
import PremiumBadge from '../components/ui/PremiumBadge';
import useDsaData from '../hooks/useDsaData';
import { progressApi } from '../lib/api';
import { HeatmapCalendar } from "@/components/heatmap-calendar";

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

const DSATracker = () => {
    const {
        email,
        sheets,
        totalSolved,
        totalProblems,
        overallProgress,
        streak,
        longestStreak,
        totalStudyMinutes,
        sheetStatsById,
        dsaMutationVersion,
        loading,
        error,
        warning,
        refresh,
    } = useDsaData();

    const [heatmapData, setHeatmapData] = useState({
        rows: [],
        timezone: 'UTC',
        from: null,
        to: null,
    });
    const [heatmapLoading, setHeatmapLoading] = useState(true);
    const [heatmapError, setHeatmapError] = useState('');
    const [heatmapNonce, setHeatmapNonce] = useState(0);
    const hasHeatmapSnapshotRef = useRef(false);
    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );

    useEffect(() => {
        hasHeatmapSnapshotRef.current = Array.isArray(heatmapData.rows) && heatmapData.rows.length > 0;
    }, [heatmapData.rows]);

    useEffect(() => {
        const loadHeatmap = async () => {
            if (!email) {
                setHeatmapData({
                    rows: [],
                    timezone: 'UTC',
                    from: null,
                    to: null,
                });
                setHeatmapError('');
                setHeatmapLoading(false);
                return;
            }

            setHeatmapLoading(true);
            setHeatmapError('');

            try {
                const data = await progressApi.getHeatmap(email, 365);
                setHeatmapData({
                    rows: Array.isArray(data?.rows) ? data.rows : [],
                    timezone: data?.timezone || 'UTC',
                    from: data?.from || null,
                    to: data?.to || null,
                });
            } catch (err) {
                if (!isTransientApiError(err)) {
                    console.error('Failed to load heatmap:', err);
                }
                if (hasHeatmapSnapshotRef.current) {
                    setHeatmapError('Contribution graph refresh is limited. Showing the last synced graph.');
                } else {
                    setHeatmapData({
                        rows: [],
                        timezone: 'UTC',
                        from: null,
                        to: null,
                    });
                    setHeatmapError('Unable to load contribution graph right now.');
                }
            } finally {
                setHeatmapLoading(false);
            }
        };

        loadHeatmap();
    }, [email, dsaMutationVersion, heatmapNonce]);

    const studyHours = Math.round(totalStudyMinutes / 60);
    const data = useMemo(() => makeData(heatmapData.rows), [heatmapData.rows]);

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <PremiumBadge tone="subtle">DSA Command Center</PremiumBadge>
                        <PremiumBadge tone="accent">Premium Focus</PremiumBadge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-semibold text-foreground font-display tracking-tight">DSA Tracker</h1>
                    <p className="text-muted-foreground text-lg font-light">
                        Track global progress, monitor yearly consistency, and jump into each sheet with focus.
                    </p>
                </motion.header>

                {error && !loading && (
                    <GlassCard className="p-6" hoverEffect={false}>
                        <p className="text-sm text-rose-500 mb-3">{error}</p>
                        <button
                            type="button"
                            onClick={() => {
                                refresh();
                                setHeatmapNonce((value) => value + 1);
                            }}
                            className="rounded-xl px-4 py-2 bg-foreground text-background text-sm font-semibold"
                        >
                            Retry loading DSA data
                        </button>
                    </GlassCard>
                )}

                {warning && !loading && (
                    <GlassCard className="p-4" hoverEffect={false}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-amber-500">{warning}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    refresh();
                                    setHeatmapNonce((value) => value + 1);
                                }}
                                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-foreground/40"
                            >
                                Retry
                            </button>
                        </div>
                    </GlassCard>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Global Solved</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : `${totalSolved}/${totalProblems}`}</p>
                    </GlassCard>

                    <GlassCard className="p-5" hoverEffect={false} premium>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Completion</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : `${overallProgress}%`}</p>
                        <div className="premium-progress-track h-2 w-full rounded-full bg-foreground/10 mt-2">
                            <div className="premium-progress-fill h-full rounded-full bg-foreground" style={{ width: `${overallProgress}%` }} />
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Current Streak</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : streak}</p>
                        <p className="text-xs text-muted-foreground mt-1">Longest: {loading ? '...' : longestStreak} days</p>
                    </GlassCard>

                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Study Time</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : studyHours}</p>
                        <p className="text-xs text-muted-foreground mt-1">Hours logged</p>
                    </GlassCard>
                </div>

                <div className="space-y-2">
                    {heatmapError && !heatmapLoading && (
                        <p className="text-sm text-amber-500">{heatmapError}</p>
                    )}
                    <HeatmapCalendar
                        title="Contribution Activity (Last 365 days)"
                        data={data}
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
                        loading={heatmapLoading || loading}
                        timezone={heatmapData.timezone}
                        from={heatmapData.from}
                        to={heatmapData.to}
                    />
                </div>

                <div className="space-y-3">
                    <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Sheets</h2>
                    <DsaSheetCards sheets={sheets} sheetStatsById={sheetStatsById} />
                </div>
            </div>
        </div>
    );
};

export default DSATracker;
