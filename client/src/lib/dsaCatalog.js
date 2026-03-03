export const DEFAULT_SHEET_ID = 'love450';
export const SUPPORTED_SHEET_IDS = ['love450', 'striverSDE', 'striverA2Z'];

export const normalizeLegacyCatalog = (catalogData) => {
    const topics = Array.isArray(catalogData?.topics) ? catalogData.topics : [];

    return [
        {
            id: 'legacy',
            name: 'DSA Sheet',
            totalTopics: topics.length,
            totalProblems: topics.reduce((sum, topic) => sum + (topic.total || topic.problems?.length || 0), 0),
            topics: topics.map((topic, topicIndex) => ({
                id: topic.id ?? topicIndex + 1,
                sheetId: 'legacy',
                name: topic.name || `Topic ${topicIndex + 1}`,
                position: topic.position ?? topicIndex,
                total: topic.total || topic.problems?.length || 0,
                problems: (topic.problems || []).map((problem, problemIndex) => ({
                    id: String(problem.id ?? `legacy:${topicIndex}:${problemIndex}`),
                    title: problem.title || `Problem ${problemIndex + 1}`,
                    difficulty: problem.difficulty || 'Unknown',
                    external_url: problem.external_url || problem.link || '#',
                    solution_url: problem.solution_url || '',
                    source_platform: problem.source_platform || 'other',
                })),
            })),
        },
    ];
};

export const orderSheetsByPreferredFlow = (sheets = []) => {
    const orderMap = new Map(SUPPORTED_SHEET_IDS.map((id, index) => [id, index]));
    return [...sheets].sort((a, b) => {
        const aOrder = orderMap.has(a.id) ? orderMap.get(a.id) : Number.MAX_SAFE_INTEGER;
        const bOrder = orderMap.has(b.id) ? orderMap.get(b.id) : Number.MAX_SAFE_INTEGER;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return String(a.name || '').localeCompare(String(b.name || ''));
    });
};

export const isSupportedSheetId = (sheetId) => SUPPORTED_SHEET_IDS.includes(sheetId);

export const getSafeSheets = (catalogData) => {
    if (Array.isArray(catalogData?.sheets) && catalogData.sheets.length > 0) {
        return catalogData.sheets;
    }
    return normalizeLegacyCatalog(catalogData);
};

export const buildCatalogProblemIdSet = (sheets) => {
    const ids = new Set();
    for (const sheet of sheets || []) {
        for (const topic of sheet.topics || []) {
            for (const problem of topic.problems || []) {
                ids.add(problem.id);
            }
        }
    }
    return ids;
};

export const getTotalProblems = (sheets) => (
    (sheets || []).reduce((sum, sheet) => sum + (sheet.totalProblems || 0), 0)
);

export const getTotalSolvedFromSet = (solvedSet, catalogProblemIds) => {
    let solved = 0;
    for (const id of solvedSet) {
        if (catalogProblemIds.has(id)) solved += 1;
    }
    return solved;
};

export const getSheetById = (sheets, sheetId) => (
    (sheets || []).find((sheet) => sheet.id === sheetId) || null
);

export const getSheetSolvedStats = (sheet, solvedSet) => {
    if (!sheet) return { solved: 0, total: 0, progress: 0 };

    let solved = 0;
    for (const topic of sheet.topics || []) {
        for (const problem of topic.problems || []) {
            if (solvedSet.has(problem.id)) solved += 1;
        }
    }

    const total = sheet.totalProblems || 0;
    return {
        solved,
        total,
        progress: total > 0 ? Math.round((solved / total) * 100) : 0,
    };
};
