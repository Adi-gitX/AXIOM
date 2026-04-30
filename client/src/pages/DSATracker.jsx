import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DsaSheetCards from '../components/dsa/DsaSheetCards';
import UpcomingSheets from '../components/dsa/UpcomingSheets';
import { PageHeader, Section, Surface, KpiTile } from '../components/ui/AppPrimitives';
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
        <div className="px-5 sm:px-8 lg:px-14 py-8 lg:py-16">
            <div className="max-w-6xl mx-auto">
                <PageHeader
                    eyebrow="Engineering"
                    title="DSA Tracker"
                    tail="— ship one a day."
                    meta="Track problems across curated sheets · 1,096 problems available"
                />

                {error && !loading && (
                    <Surface className="p-5 mb-6">
                        <p className="text-sm text-[#9C2A1F] mb-3">{error}</p>
                        <button
                            type="button"
                            onClick={() => {
                                refresh();
                                setHeatmapNonce((value) => value + 1);
                            }}
                            className="rounded-full px-4 h-8 bg-foreground text-background text-[12px] font-semibold hover:opacity-90 transition-opacity"
                        >
                            Retry
                        </button>
                    </Surface>
                )}

                {warning && !loading && (
                    <Surface className="p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-[#7A4A1F]">{warning}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    refresh();
                                    setHeatmapNonce((value) => value + 1);
                                }}
                                className="rounded-full bg-card border px-3 h-8 text-xs font-semibold text-foreground hover:border-foreground/15 transition-colors"
                                style={{ borderColor: 'hsl(var(--hair))' }}
                            >
                                Retry
                            </button>
                        </div>
                    </Surface>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
                    <KpiTile label="Solved" value={loading ? '—' : `${totalSolved}`} hint={`of ${totalProblems}`} />
                    <KpiTile label="Completion" value={loading ? '—' : `${overallProgress}%`} hint="overall mastery" />
                    <KpiTile label="Streak" value={loading ? '—' : `${streak}`} hint={`longest ${loading ? '—' : longestStreak}d`} />
                    <KpiTile label="Studied" value={loading ? '—' : `${studyHours}h`} hint="logged total" />
                </div>

                <Section label="Activity">
                    {heatmapError && !heatmapLoading && (
                        <p className="text-sm text-[#7A4A1F] mb-3">{heatmapError}</p>
                    )}
                    <Surface className="p-6">
                        <HeatmapCalendar
                            title=""
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
                    </Surface>
                </Section>

                <Section label="Sheets">
                    <DsaSheetCards sheets={sheets} sheetStatsById={sheetStatsById} />
                </Section>

                <CompaniesTeaser />

                <Section>
                    <UpcomingSheets />
                </Section>
            </div>
        </div>
    );
};

const CompaniesTeaser = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = React.useState([]);
    React.useEffect(() => {
        fetch(((import.meta.env.VITE_API_URL || '') + '/api/dsa/companies'))
            .then((r) => r.json())
            .then((d) => setCompanies((d.companies || []).slice(0, 8)))
            .catch(() => {});
    }, []);
    if (companies.length === 0) return null;
    return (
        <Section
            eyebrow="New"
            label="Prep by company"
            action={
                <button
                    onClick={() => navigate('/app/dsa/companies')}
                    data-testid="dsa-companies-cta"
                    className="inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground hover:text-[#0E334F] transition-colors"
                >
                    All companies →
                </button>
            }
        >
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {companies.map((c) => (
                    <button
                        key={c.slug}
                        onClick={() => navigate(`/app/dsa/companies/${c.slug}`)}
                        data-testid={`dsa-company-tile-${c.slug}`}
                        className="bg-card border rounded-2xl p-3.5 text-left hover-lift"
                        style={{ borderColor: 'hsl(var(--hair))' }}
                    >
                        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center font-display font-semibold text-[14px] text-foreground mb-2.5">
                            {c.initial}
                        </div>
                        <p className="text-[12.5px] font-semibold text-foreground truncate">{c.name}</p>
                        <p className="text-[10.5px] text-muted-foreground tabular mt-0.5">{c.count} problems</p>
                    </button>
                ))}
            </div>
        </Section>
    );
};

export default DSATracker;
