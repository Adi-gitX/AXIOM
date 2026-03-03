import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import DsaContributionGraph from '../components/dsa/DsaContributionGraph';
import DsaSheetCards from '../components/dsa/DsaSheetCards';
import useDsaData from '../hooks/useDsaData';
import { progressApi } from '../lib/api';

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
                console.error('Failed to load heatmap:', err);
                setHeatmapData({
                    rows: [],
                    timezone: 'UTC',
                    from: null,
                    to: null,
                });
                setHeatmapError('Unable to load contribution graph right now.');
            } finally {
                setHeatmapLoading(false);
            }
        };

        loadHeatmap();
    }, [email, dsaMutationVersion, heatmapNonce]);

    const studyHours = Math.round(totalStudyMinutes / 60);

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                >
                    <h1 className="text-5xl font-light text-foreground font-display tracking-tight">DSA Tracker</h1>
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Global Solved</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : `${totalSolved}/${totalProblems}`}</p>
                    </GlassCard>

                    <GlassCard className="p-5" hoverEffect={false}>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Completion</p>
                        <p className="text-3xl font-light mt-2">{loading ? '...' : `${overallProgress}%`}</p>
                        <div className="h-2 w-full rounded-full bg-foreground/10 overflow-hidden mt-2">
                            <div className="h-full rounded-full bg-foreground" style={{ width: `${overallProgress}%` }} />
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
                    <DsaContributionGraph
                        rows={heatmapData.rows}
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
