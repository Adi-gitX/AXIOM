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

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export const clearDsaDataCache = () => {
    catalogCache = null;
};

const useDsaData = () => {
    const { currentUser } = useAuth();
    const {
        solvedProblems,
        loadSolvedProblems,
        toggleProblem,
        dsaMutationVersion,
    } = useStore();

    const [sheets, setSheets] = useState([]);
    const [progressInfo, setProgressInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const email = currentUser?.email || null;

    const initialize = useCallback(async (forceCatalog = false, silent = false) => {
        if (!silent) {
            setLoading(true);
        }
        setError('');

        try {
            let safeSheets = catalogCache;
            if (!safeSheets || forceCatalog) {
                const catalogData = await progressApi.getCatalog();
                safeSheets = orderSheetsByPreferredFlow(getSafeSheets(catalogData));
                catalogCache = safeSheets;
            }
            setSheets(safeSheets);

            if (email) {
                setUserEmail(email);
                const progressData = await loadSolvedProblems(email);
                if (progressData?.progress) {
                    setProgressInfo(progressData.progress);
                } else {
                    setProgressInfo(null);
                }
            } else {
                setUserEmail(null);
                setProgressInfo(null);
            }
        } catch (err) {
            console.error('Failed to initialize DSA data:', err);
            setError('Failed to load DSA data. Please retry.');
        } finally {
            if (!silent) {
                setLoading(false);
            }
        }
    }, [email, loadSolvedProblems]);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (!email || dsaMutationVersion <= 0) {
            return;
        }
        initialize(false, true);
    }, [email, dsaMutationVersion, initialize]);

    const solvedSet = useMemo(() => new Set(solvedProblems), [solvedProblems]);

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

    const getSheet = useCallback((sheetId) => getSheetById(sheets, sheetId), [sheets]);

    return {
        email,
        sheets,
        solvedProblems,
        solvedSet,
        catalogProblemIdSet,
        totalProblems,
        totalSolved,
        overallProgress,
        sheetStatsById,
        progressInfo,
        streak,
        longestStreak,
        totalStudyMinutes,
        dsaMutationVersion,
        loading,
        error,
        defaultSheetId: DEFAULT_SHEET_ID,
        getSheet,
        toggleProblem,
        refresh,
    };
};

export default useDsaData;
