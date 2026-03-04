import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import DsaFilters from '../components/dsa/DsaFilters';
import DsaTopicAccordion from '../components/dsa/DsaTopicAccordion';
import SheetTabs from '../components/dsa/SheetTabs';
import useDsaData from '../hooks/useDsaData';
import { isSupportedSheetId } from '../lib/dsaCatalog';

const DEFAULT_FILTERS = {
    query: '',
    status: 'all',
    difficulty: 'all',
    company: '',
    sort: 'sheet-order',
};

const parseFilters = (searchParams) => {
    const status = searchParams.get('status');
    const difficulty = searchParams.get('difficulty');
    const sort = searchParams.get('sort');

    return {
        query: searchParams.get('q') || '',
        status: status === 'solved' || status === 'unsolved' ? status : DEFAULT_FILTERS.status,
        difficulty: ['Easy', 'Medium', 'Hard', 'Unknown'].includes(difficulty)
            ? difficulty
            : DEFAULT_FILTERS.difficulty,
        company: searchParams.get('c') || '',
        sort: ['sheet-order', 'topic-a-z', 'most-complete'].includes(sort)
            ? sort
            : DEFAULT_FILTERS.sort,
    };
};

const buildSearchParams = (filters) => {
    const params = new URLSearchParams();
    if (filters.query.trim()) params.set('q', filters.query.trim());
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.difficulty !== 'all') params.set('difficulty', filters.difficulty);
    if (filters.company.trim()) params.set('c', filters.company.trim());
    if (filters.sort !== 'sheet-order') params.set('sort', filters.sort);
    return params;
};

const DSASheetPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { sheetId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const {
        sheets,
        solvedSet,
        pendingProblemSet,
        loading,
        error,
        warning,
        getSheet,
        toggleProblem,
        dsaLastError,
        clearDsaError,
        sheetStatsById,
        problemMetaById,
        reviewQueue,
        saveProblemMeta,
        completeReview,
        refreshProblemMeta,
        refreshReviewQueue,
        refresh,
    } = useDsaData();

    const [expandedTopicId, setExpandedTopicId] = useState(null);
    const [focusedProblemId, setFocusedProblemId] = useState('');

    const isSupportedRoute = isSupportedSheetId(sheetId);
    const sheet = useMemo(() => getSheet(sheetId), [getSheet, sheetId]);
    const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

    useEffect(() => {
        if (isSupportedRoute && !loading && !sheet) {
            navigate('/app/dsa', { replace: true });
        }
    }, [isSupportedRoute, loading, sheet, navigate]);

    const filteredTopics = useMemo(() => {
        if (!sheet) return [];

        const query = filters.query.trim().toLowerCase();
        const companyQuery = filters.company.trim().toLowerCase();

        const topicsWithFilteredProblems = (sheet.topics || []).map((topic) => {
            const topicName = String(topic.name || '').toLowerCase();
            const topicMatch = !query || topicName.includes(query);
            const fullTotal = topic.total || topic.problems?.length || 0;
            const fullSolved = (topic.problems || []).reduce(
                (sum, problem) => sum + (solvedSet.has(problem.id) ? 1 : 0),
                0
            );

            const problems = (topic.problems || []).filter((problem) => {
                const titleMatch = !query || String(problem.title || '').toLowerCase().includes(query);
                if (!topicMatch && !titleMatch) return false;

                if (filters.status === 'solved' && !solvedSet.has(problem.id)) return false;
                if (filters.status === 'unsolved' && solvedSet.has(problem.id)) return false;
                if (filters.difficulty !== 'all' && problem.difficulty !== filters.difficulty) return false;

                if (companyQuery) {
                    const tags = Array.isArray(problem.company_tags) ? problem.company_tags : [];
                    const hasCompany = tags.some((tag) => String(tag).toLowerCase().includes(companyQuery));
                    if (!hasCompany) return false;
                }

                return true;
            });

            if (problems.length === 0) return null;

            return {
                ...topic,
                problems,
                __fullTotal: fullTotal,
                __fullSolved: fullSolved,
            };
        }).filter(Boolean);

        const sorted = [...topicsWithFilteredProblems];
        if (filters.sort === 'topic-a-z') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filters.sort === 'most-complete') {
            sorted.sort((a, b) => {
                const aProgress = a.__fullTotal > 0 ? a.__fullSolved / a.__fullTotal : 0;
                const bProgress = b.__fullTotal > 0 ? b.__fullSolved / b.__fullTotal : 0;
                if (bProgress !== aProgress) return bProgress - aProgress;
                return a.name.localeCompare(b.name);
            });
        } else {
            sorted.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        }

        return sorted;
    }, [sheet, solvedSet, filters]);

    const reviewItems = useMemo(
        () => (reviewQueue || []).filter((item) => item.sheetId === sheetId),
        [reviewQueue, sheetId]
    );

    const visibleProblemCount = useMemo(
        () => filteredTopics.reduce((sum, topic) => sum + topic.problems.length, 0),
        [filteredTopics]
    );

    const handleFilterChange = (nextPart) => {
        const nextFilters = { ...filters, ...nextPart };
        setSearchParams(buildSearchParams(nextFilters), { replace: true });
    };

    const handleFilterReset = () => {
        setSearchParams(buildSearchParams(DEFAULT_FILTERS), { replace: true });
    };

    const handleSheetChange = (nextSheetId) => {
        navigate({
            pathname: `/app/dsa/${nextSheetId}`,
            search: location.search,
        });
    };

    const handleSaveProblemMeta = async (problemId, payload) => {
        await saveProblemMeta({ problemId, ...payload });
    };

    const handleReviewComplete = async (problemId, rating) => {
        await completeReview(problemId, rating);
    };

    if (!isSupportedRoute) {
        return <Navigate to="/app/dsa" replace />;
    }

    if (!loading && !sheet) return null;

    const sheetStats = sheet ? (sheetStatsById[sheet.id] || { solved: 0, total: 0, progress: 0 }) : null;

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <button
                        type="button"
                        onClick={() => navigate('/app/dsa')}
                        className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    >
                        ← Back to DSA Home
                    </button>
                    <h1 className="text-4xl lg:text-5xl font-light text-foreground font-display tracking-tight">
                        {sheet?.name || 'Loading Sheet...'}
                    </h1>
                    {sheetStats && (
                        <p className="text-sm text-muted-foreground">
                            {sheetStats.solved}/{sheetStats.total} solved • {sheetStats.progress}% complete
                        </p>
                    )}
                </motion.header>

                {error && !loading && (
                    <GlassCard className="p-6" hoverEffect={false}>
                        <p className="text-sm text-rose-500 mb-3">{error}</p>
                        <button
                            type="button"
                            onClick={refresh}
                            className="rounded-xl px-4 py-2 bg-foreground text-background text-sm font-semibold"
                        >
                            Retry loading data
                        </button>
                    </GlassCard>
                )}

                {warning && !loading && (
                    <GlassCard className="p-4" hoverEffect={false}>
                        <p className="text-sm text-amber-500">{warning}</p>
                    </GlassCard>
                )}

                {dsaLastError && (
                    <GlassCard className="p-4" hoverEffect={false}>
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm text-rose-500">
                                {dsaLastError.code === 'AUTH_MISSING_TOKEN'
                                    ? 'Session not ready. Please retry this toggle in a moment.'
                                    : dsaLastError.message}
                            </p>
                            <button
                                type="button"
                                onClick={clearDsaError}
                                className="text-xs text-muted-foreground hover:text-foreground"
                            >
                                Dismiss
                            </button>
                        </div>
                    </GlassCard>
                )}

                <GlassCard className="p-5 space-y-4" hoverEffect={false}>
                    <SheetTabs
                        sheets={sheets}
                        activeSheetId={sheet?.id}
                        solvedSet={solvedSet}
                        onChange={handleSheetChange}
                    />

                    <DsaFilters
                        filters={filters}
                        onChange={handleFilterChange}
                        onReset={handleFilterReset}
                    />

                    <p className="text-xs text-muted-foreground font-mono">
                        Showing {filteredTopics.length} topics • {visibleProblemCount} visible problems
                    </p>
                </GlassCard>

                <GlassCard className="p-5" hoverEffect={false}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <p className="text-sm font-semibold text-foreground">Review Today</p>
                        <span className="text-xs text-muted-foreground font-mono">{reviewItems.length} due</span>
                    </div>

                    {reviewItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No due reviews in this sheet. Keep solving and scheduling reviews.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {reviewItems.slice(0, 6).map((item) => (
                                <button
                                    key={item.problemId}
                                    type="button"
                                    onClick={() => {
                                        setExpandedTopicId(item.topicId);
                                        setFocusedProblemId(item.problemId);
                                    }}
                                    className="text-left rounded-xl border border-border bg-background/40 px-3 py-2 hover:border-foreground/30 transition-colors"
                                >
                                    <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                                    <p className="text-[11px] text-muted-foreground mt-1">
                                        Due {item.reviewDueDate || 'today'} • {item.topicName}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </GlassCard>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((item) => (
                            <GlassCard key={item} className="p-5" hoverEffect={false}>
                                <div className="h-4 w-56 bg-foreground/10 rounded animate-pulse" />
                                <div className="h-3 w-40 bg-foreground/10 rounded animate-pulse mt-3" />
                            </GlassCard>
                        ))}
                    </div>
                ) : filteredTopics.length === 0 ? (
                    <GlassCard className="p-8 text-center" hoverEffect={false}>
                        <p className="text-lg text-foreground">No matching problems found</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Adjust search or filters to see topics.
                        </p>
                    </GlassCard>
                ) : (
                    <div className="space-y-3">
                        {filteredTopics.map((topic) => (
                            <DsaTopicAccordion
                                key={topic.id}
                                topic={topic}
                                solvedSet={solvedSet}
                                pendingProblemSet={pendingProblemSet}
                                isExpanded={expandedTopicId === topic.id}
                                focusedProblemId={focusedProblemId}
                                problemMetaById={problemMetaById}
                                onToggleExpand={() => setExpandedTopicId((prev) => (prev === topic.id ? null : topic.id))}
                                onToggleProblem={toggleProblem}
                                onSaveProblemMeta={handleSaveProblemMeta}
                                onCompleteReview={handleReviewComplete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DSASheetPage;
