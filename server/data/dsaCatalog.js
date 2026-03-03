import {
    DSA_SHEETS as GENERATED_DSA_SHEETS,
    DSA_TOTAL_PROBLEMS as GENERATED_DSA_TOTAL_PROBLEMS,
    DSA_TOTAL_TOPICS as GENERATED_DSA_TOTAL_TOPICS,
} from './dsaCatalog.generated.js';

/**
 * @typedef {Object} CatalogProblem
 * @property {string} id
 * @property {string} title
 * @property {('Easy'|'Medium'|'Hard'|'Unknown')} difficulty
 * @property {string} external_url
 * @property {string} solution_url
 * @property {('leetcode'|'geeksforgeeks'|'interviewbit'|'other')} source_platform
 */

/**
 * @typedef {Object} CatalogTopic
 * @property {number} id
 * @property {string} sheetId
 * @property {string} name
 * @property {number} position
 * @property {number} total
 * @property {CatalogProblem[]} problems
 */

/**
 * @typedef {Object} CatalogSheet
 * @property {string} id
 * @property {string} name
 * @property {number} totalTopics
 * @property {number} totalProblems
 * @property {CatalogTopic[]} topics
 */

/** @type {Record<string, string>} */
export const LEGACY_PROBLEM_ID_MAP = {
    a1: 'striverSDE:0:0',
    a2: 'striverSDE:0:1',
    a3: 'striverSDE:0:2',
    a4: 'striverSDE:0:3',
    a5: 'striverSDE:0:4',
    a6: 'striverSDE:0:5',
    l1: 'striverSDE:4:0',
    l2: 'striverSDE:4:1',
    l3: 'striverSDE:4:2',
    l4: 'striverSDE:4:3',
    l5: 'striverSDE:4:4',
    g1: 'striverSDE:7:0',
    g2: 'striverSDE:7:1',
    g3: 'striverSDE:7:2',
    g4: 'striverSDE:7:3',
    r1: 'striverSDE:8:0',
    r2: 'striverSDE:8:1',
    r3: 'striverSDE:8:2',
};

/** @type {CatalogSheet[]} */
export const DSA_SHEETS = GENERATED_DSA_SHEETS;
/** @type {CatalogTopic[]} */
export const DSA_TOPICS = DSA_SHEETS.flatMap((sheet) => sheet.topics);

export const DSA_TOTAL_TOPICS = GENERATED_DSA_TOTAL_TOPICS;
export const DSA_TOTAL_PROBLEMS = GENERATED_DSA_TOTAL_PROBLEMS;

const PROBLEM_INDEX = {};
for (const sheet of DSA_SHEETS) {
    for (const topic of sheet.topics) {
        for (const problem of topic.problems) {
            PROBLEM_INDEX[problem.id] = {
                canonicalId: problem.id,
                problem,
                topic,
                topicId: topic.id,
                sheet,
                sheetId: sheet.id,
            };
        }
    }
}

const CANONICAL_IDS = new Set(Object.keys(PROBLEM_INDEX));
const CANONICAL_ID_BY_LOWER = new Map(
    Array.from(CANONICAL_IDS).map((id) => [id.toLowerCase(), id])
);

const LEGACY_MAP_LOWER = new Map(
    Object.entries(LEGACY_PROBLEM_ID_MAP).map(([legacyId, canonicalId]) => [legacyId.toLowerCase(), canonicalId])
);

const LEGACY_IDS_BY_CANONICAL = new Map();
for (const [legacyId, canonicalId] of Object.entries(LEGACY_PROBLEM_ID_MAP)) {
    if (!LEGACY_IDS_BY_CANONICAL.has(canonicalId)) {
        LEGACY_IDS_BY_CANONICAL.set(canonicalId, []);
    }
    LEGACY_IDS_BY_CANONICAL.get(canonicalId).push(legacyId);
}

/**
 * @typedef {(problemId: string | null | undefined) => string | null} ProblemIdCanonicalizer
 */

/** @type {ProblemIdCanonicalizer} */
export const canonicalizeProblemId = (problemId) => {
    if (typeof problemId !== 'string') return null;

    const candidate = problemId.trim();
    if (!candidate) return null;

    if (CANONICAL_IDS.has(candidate)) {
        return candidate;
    }

    const lower = candidate.toLowerCase();

    if (LEGACY_MAP_LOWER.has(lower)) {
        return LEGACY_MAP_LOWER.get(lower) || null;
    }

    return CANONICAL_ID_BY_LOWER.get(lower) || null;
};

export const isValidProblemId = (problemId) => canonicalizeProblemId(problemId) !== null;

export const getAliasesForProblemId = (problemId) => {
    const canonicalId = canonicalizeProblemId(problemId);
    if (!canonicalId) return [];

    const legacyAliases = LEGACY_IDS_BY_CANONICAL.get(canonicalId) || [];
    return [canonicalId, ...legacyAliases];
};

export const getProblemMeta = (problemId) => {
    const canonicalId = canonicalizeProblemId(problemId);
    if (!canonicalId) return null;
    return PROBLEM_INDEX[canonicalId] || null;
};

export const getSheetById = (sheetId) => DSA_SHEETS.find((sheet) => sheet.id === sheetId) || null;

export default DSA_TOPICS;
