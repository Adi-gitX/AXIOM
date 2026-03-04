import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useStore, { setUserEmail } from '../store/useStore';
import { progressApi } from '../lib/api';
import {
    DEFAULT_SHEET_ID,
    getSafeSheets,
    buildCatalogProblemIdSet,
    getTotalProblems,
    getTotalSolvedFromSet,
    getSheetById,
    getSheetSolvedStats,
    orderSheetsByPreferredFlow,
} from '../lib/dsaCatalog';

let catalogCache = null;
let catalogFetchPromise = null;
const dsaUserSnapshotCache = new Map();
const dsaInitInFlightByKey = new Map();
const USER_SNAPSHOT_TTL_MS = 30 * 1000;

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const toSnapshot = (payload) => ({
    progressInfo: payload?.progressInfo || null,
    problemMetaById: payload?.problemMetaById || {},
    reviewQueue: Array.isArray(payload?.reviewQueue) ? payload.reviewQueue : [],
    fetchedAt: Date.now(),
});

const getCachedUserSnapshot = (email) => {
    const key = normalizeEmail(email);
    if (!key) return null;
    const snapshot = dsaUserSnapshotCache.get(key);
    if (!snapshot) return null;
    if ((Date.now() - Number(snapshot.fetchedAt || 0)) > USER_SNAPSHOT_TTL_MS) return null;
    return snapshot;
};

export const clearDsaDataCache = () => {
    catalogCache = null;
    catalogFetchPromise = null;
    dsaUserSnapshotCache.clear();
    dsaInitInFlightByKey.clear();
};

const resolveCatalogSheets = async (forceCatalog = false) => {
    if (catalogCache && !forceCatalog) {
        return {
            sheets: catalogCache,
            warning: '',
        };
    }

    if (!catalogFetchPromise || forceCatalog) {
        catalogFetchPromise = progressApi.getCatalog()
            .then((catalogData) => {
                const safeSheets = orderSheetsByPreferredFlow(getSafeSheets(catalogData));
                catalogCache = safeSheets;
                return safeSheets;
            })
            .finally(() => {
                catalogFetchPromise = null;
            });
    }

    try {
        const sheets = await catalogFetchPromise;
        return { sheets, warning: '' };
    } catch (error) {
        if (catalogCache) {
            return {
                sheets: catalogCache,
                warning: 'Catalog refresh is limited right now. Showing cached sheet data.',
            };
        }
        throw error;
    }
};

const useDsaData = () => {
    const { currentUser } = useAuth();
    const {
        solvedProblems,
        loadSolvedProblems,
        toggleProblem: toggleProblemInStore,
        bumpDsaMutationVersion,
        pendingProblemIds,
        dsaLastError,
        clearDsaError,
        dsaMutationVersion,
    } = useStore();

    const [sheets, setSheets] = useState([]);
    const [progressInfo, setProgressInfo] = useState(null);
    const [problemMetaById, setProblemMetaById] = useState({});
    const [reviewQueue, setReviewQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');

    const email = currentUser?.email || null;
    const normalizedEmail = normalizeEmail(email);

    useEffect(() => {
        setUserEmail(email);
    }, [email]);

    const initialize = useCallback(async (forceCatalog = false, silent = false) => {
        if (!silent) {
            setLoading(true);
        }
        setError('');

        const initKey = `${normalizedEmail || 'anonymous'}|${forceCatalog ? 'force' : 'standard'}`;
        if (!dsaInitInFlightByKey.has(initKey)) {
            const initializationPromise = (async () => {
                const warningMessages = [];
                const { sheets: resolvedSheets, warning: catalogWarning } = await resolveCatalogSheets(forceCatalog);
                if (catalogWarning) {
                    warningMessages.push(catalogWarning);
                }

                const payload = {
                    sheets: resolvedSheets,
                    progressInfo: null,
                    problemMetaById: {},
                    reviewQueue: [],
                    warning: '',
                };

                if (!normalizedEmail) {
                    return payload;
                }

                const staleSnapshot = getCachedUserSnapshot(normalizedEmail);
                const [progressData, metaResult, reviewResult] = await Promise.all([
                    loadSolvedProblems(normalizedEmail).catch(() => null),
                    progressApi.getProblemMeta(normalizedEmail)
                        .then((data) => ({ data, error: null }))
                        .catch((metaError) => ({ data: null, error: metaError })),
                    progressApi.getReviewQueue(normalizedEmail, { limit: 100, daysAhead: 0 })
                        .then((data) => ({ data, error: null }))
                        .catch((reviewError) => ({ data: null, error: reviewError })),
                ]);

                const hasProgress = Boolean(progressData?.progress);
                const hasMeta = Boolean(metaResult?.data?.metaByProblemId);
                const hasReview = Array.isArray(reviewResult?.data?.items);

                payload.progressInfo = hasProgress
                    ? progressData.progress
                    : staleSnapshot?.progressInfo || null;
                payload.problemMetaById = hasMeta
                    ? (metaResult.data.metaByProblemId || {})
                    : staleSnapshot?.problemMetaById || {};
                payload.reviewQueue = hasReview
                    ? (reviewResult.data.items || [])
                    : staleSnapshot?.reviewQueue || [];

                if (!hasProgress && staleSnapshot) {
                    warningMessages.push('Progress refresh is limited. Showing your last synced DSA snapshot.');
                }
                if (metaResult?.error && staleSnapshot) {
                    warningMessages.push('Problem notes/time are temporarily stale.');
                }
                if (reviewResult?.error && staleSnapshot) {
                    warningMessages.push('Review queue is temporarily stale.');
                }

                dsaUserSnapshotCache.set(normalizedEmail, toSnapshot(payload));
                payload.warning = warningMessages.join(' ');
                return payload;
            })().finally(() => {
                dsaInitInFlightByKey.delete(initKey);
            });

            dsaInitInFlightByKey.set(initKey, initializationPromise);
        }

        try {
            const payload = await dsaInitInFlightByKey.get(initKey);
            setSheets(payload.sheets || []);
            setProgressInfo(payload.progressInfo || null);
            setProblemMetaById(payload.problemMetaById || {});
            setReviewQueue(Array.isArray(payload.reviewQueue) ? payload.reviewQueue : []);
            setWarning(payload.warning || '');
        } catch (err) {
            console.error('Failed to initialize DSA data:', err);
            const fallbackSheets = catalogCache || [];
            if (fallbackSheets.length > 0) {
                setSheets(fallbackSheets);
                setWarning('Network is limited. Showing cached DSA data.');
                setError('');
            } else {
                setError('Failed to load DSA data. Please retry.');
            }
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [normalizedEmail, loadSolvedProblems]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (!normalizedEmail || dsaMutationVersion <= 0) {
            return;
        }
        initialize(false, true);
    }, [normalizedEmail, dsaMutationVersion, initialize]);

    const solvedSet = useMemo(() => new Set(solvedProblems), [solvedProblems]);
    const pendingProblemSet = useMemo(() => new Set(pendingProblemIds || []), [pendingProblemIds]);

    const catalogProblemIdSet = useMemo(
        () => buildCatalogProblemIdSet(sheets),
        [sheets]
    );

    const totalProblems = useMemo(() => getTotalProblems(sheets), [sheets]);

    const totalSolved = useMemo(
        () => getTotalSolvedFromSet(solvedSet, catalogProblemIdSet),
        [solvedSet, catalogProblemIdSet]
    );

    const overallProgress = totalProblems > 0
        ? Math.round((totalSolved / totalProblems) * 100)
        : 0;

    const sheetStatsById = useMemo(() => {
        const map = {};
        for (const sheet of sheets) {
            map[sheet.id] = getSheetSolvedStats(sheet, solvedSet);
        }
        return map;
    }, [sheets, solvedSet]);

    const streak = toInt(progressInfo?.current_streak);
    const longestStreak = toInt(progressInfo?.longest_streak);
    const totalStudyMinutes = toInt(progressInfo?.total_study_minutes);

    const refresh = useCallback(async () => {
        await initialize(true, false);
    }, [initialize]);

    const refreshProblemMeta = useCallback(async (sheetId = '') => {
        if (!normalizedEmail) {
            setProblemMetaById({});
            return {};
        }
        const data = await progressApi.getProblemMeta(normalizedEmail, sheetId);
        const next = data?.metaByProblemId || {};
        if (!sheetId) {
            setProblemMetaById(next);
        } else {
            setProblemMetaById((prev) => ({ ...prev, ...next }));
        }
        return next;
    }, [normalizedEmail]);

    const refreshReviewQueue = useCallback(async (sheetId = '') => {
        if (!normalizedEmail) {
            setReviewQueue([]);
            return [];
        }
        const data = await progressApi.getReviewQueue(normalizedEmail, {
            sheetId,
            limit: 100,
            daysAhead: 0,
        });
        const items = Array.isArray(data?.items) ? data.items : [];
        setReviewQueue(items);
        return items;
    }, [normalizedEmail]);

    const saveProblemMeta = useCallback(async (payload) => {
        if (!normalizedEmail || !payload?.problemId) return null;
        const response = await progressApi.saveProblemMeta({
            email: normalizedEmail,
            ...payload,
        });
        const timeDeltaMinutes = Number.parseInt(response?.timeDeltaMinutes, 10);
        const canonicalId = response?.problemId || payload.problemId;
        if (response?.meta && canonicalId) {
            setProblemMetaById((prev) => ({
                ...prev,
                [canonicalId]: {
                    problemId: canonicalId,
                    notes: response.meta.notes || '',
                    timeSpentMinutes: Number.parseInt(response.meta.time_spent_minutes ?? response.meta.timeSpentMinutes, 10) || 0,
                    attempts: Number.parseInt(response.meta.attempts, 10) || 0,
                    reviewIntervalDays: Number.parseInt(response.meta.review_interval_days ?? response.meta.reviewIntervalDays, 10) || 1,
                    reviewDueDate: response.meta.review_due_date || response.meta.reviewDueDate || null,
                    lastAttemptedAt: response.meta.last_attempted_at || response.meta.lastAttemptedAt || null,
                    lastReviewedAt: response.meta.last_reviewed_at || response.meta.lastReviewedAt || null,
                    companyTags: Array.isArray(response.meta.companyTags) ? response.meta.companyTags : [],
                },
            }));
        }
        if (Number.isFinite(timeDeltaMinutes) && timeDeltaMinutes !== 0) {
            setProgressInfo((prev) => {
                if (!prev) return prev;
                const currentMinutes = Number.parseInt(prev.total_study_minutes, 10) || 0;
                return {
                    ...prev,
                    total_study_minutes: Math.max(0, currentMinutes + timeDeltaMinutes),
                };
            });
        }
        bumpDsaMutationVersion();
        return response;
    }, [normalizedEmail, bumpDsaMutationVersion]);

    const completeReview = useCallback(async (problemId, rating = 'good') => {
        if (!normalizedEmail || !problemId) return null;
        const response = await progressApi.completeReview({ email: normalizedEmail, problemId, rating });
        await Promise.all([
            refreshProblemMeta(),
            refreshReviewQueue(),
        ]);
        return response;
    }, [normalizedEmail, refreshProblemMeta, refreshReviewQueue]);

    const toggleProblem = useCallback((problemId, topicId) => (
        toggleProblemInStore(problemId, topicId, normalizedEmail)
    ), [toggleProblemInStore, normalizedEmail]);

    const getSheet = useCallback((sheetId) => getSheetById(sheets, sheetId), [sheets]);

    return {
        email: normalizedEmail,
        sheets,
        solvedProblems,
        solvedSet,
        pendingProblemSet,
        catalogProblemIdSet,
        totalProblems,
        totalSolved,
        overallProgress,
        sheetStatsById,
        progressInfo,
        problemMetaById,
        reviewQueue,
        streak,
        longestStreak,
        totalStudyMinutes,
        dsaMutationVersion,
        dsaLastError,
        loading,
        error,
        warning,
        defaultSheetId: DEFAULT_SHEET_ID,
        getSheet,
        toggleProblem,
        clearDsaError,
        saveProblemMeta,
        completeReview,
        refreshProblemMeta,
        refreshReviewQueue,
        refresh,
    };
};

export default useDsaData;
