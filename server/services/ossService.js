import { query } from '../config/db.js';
import { CURATED_GOOD_FIRST_ISSUES } from '../data/goodFirstIssuesFallback.js';
import { canonicalizeProblemId, getProblemMeta } from '../data/dsaCatalog.js';
import { getCompanyTagsForProblem } from '../data/dsaCompanyTags.js';

const parseJsonArray = (value, fallback = []) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
};

const normalizeSkillTokens = (skills = []) => {
    const raw = Array.isArray(skills) ? skills : [];
    const tokens = new Set();
    for (const skill of raw) {
        const clean = String(skill || '').trim().toLowerCase();
        if (!clean) continue;
        tokens.add(clean);
        for (const part of clean.split(/[\s/|,+-]+/)) {
            if (part) tokens.add(part);
        }
    }
    return tokens;
};

const normalizeToken = (value) => String(value || '').trim().toLowerCase();

const getTopTokens = (map, limit = 8) => (
    Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([token]) => token)
);

const buildDsaSignalForUser = async (email) => {
    const solvedResult = await query(`
        SELECT problem_id
        FROM solved_problems
        WHERE user_email = $1
    `, [email]);

    const companyFrequency = new Map();
    const topicFrequency = new Map();

    for (const row of solvedResult.rows) {
        const canonicalId = canonicalizeProblemId(row.problem_id);
        if (!canonicalId) continue;

        const companyTags = getCompanyTagsForProblem(canonicalId);
        for (const company of companyTags) {
            const token = normalizeToken(company);
            if (!token) continue;
            companyFrequency.set(token, (companyFrequency.get(token) || 0) + 1);
        }

        const meta = getProblemMeta(canonicalId);
        const topicName = normalizeToken(meta?.topic?.name || '');
        if (topicName) {
            topicFrequency.set(topicName, (topicFrequency.get(topicName) || 0) + 1);
        }
    }

    return {
        companyTokens: getTopTokens(companyFrequency),
        topicTokens: getTopTokens(topicFrequency),
    };
};

const scoreIssue = (issue, skillTokens, dsaSignal = { companyTokens: [], topicTokens: [] }) => {
    const language = String(issue.language || '').toLowerCase();
    const labels = (Array.isArray(issue.labels) ? issue.labels : [])
        .map((item) => String(item || '').toLowerCase());
    const title = String(issue.title || '').toLowerCase();
    const repo = String(issue.repo_full_name || '').toLowerCase();

    let score = 0;
    if (language && skillTokens.has(language)) score += 4;
    for (const token of skillTokens) {
        if (title.includes(token)) score += 2;
        if (labels.some((label) => label.includes(token))) score += 2;
    }
    if (labels.some((label) => label.includes('good first issue'))) score += 2;

    for (const token of dsaSignal.companyTokens || []) {
        if (!token) continue;
        if (title.includes(token) || repo.includes(token) || labels.some((label) => label.includes(token))) {
            score += 3;
        }
    }

    for (const token of dsaSignal.topicTokens || []) {
        if (!token) continue;
        if (title.includes(token) || labels.some((label) => label.includes(token))) {
            score += 2;
        }
    }

    return score;
};

const chooseBestIssue = (issues, skills = [], dsaSignal = { companyTokens: [], topicTokens: [] }) => {
    if (!Array.isArray(issues) || issues.length === 0) return null;
    const skillTokens = normalizeSkillTokens(skills);
    const scored = issues
        .map((issue) => ({
            issue,
            score: scoreIssue(issue, skillTokens, dsaSignal),
        }))
        .sort((a, b) => b.score - a.score);
    return scored[0]?.issue || null;
};

export const getIssueRecommendationForUser = async (email) => {
    if (!email) return null;

    const [userResult, dsaSignal] = await Promise.all([
        query(
            'SELECT skills FROM users WHERE email = $1 LIMIT 1',
            [email]
        ),
        buildDsaSignalForUser(email),
    ]);
    const skills = parseJsonArray(userResult.rows[0]?.skills, []);

    const cachedResult = await query(`
        SELECT repo_full_name, issue_number, title, html_url, labels_json, language
        FROM good_first_issue_cache
        WHERE is_open = 1
        ORDER BY updated_at DESC
        LIMIT 100
    `);
    const cachedIssues = cachedResult.rows.map((row) => ({
        repo_full_name: row.repo_full_name,
        issue_number: Number.parseInt(row.issue_number, 10) || row.issue_number,
        title: row.title,
        html_url: row.html_url,
        labels: parseJsonArray(row.labels_json, []),
        language: row.language || '',
    }));

    const chosenFromCache = chooseBestIssue(cachedIssues, skills, dsaSignal);
    if (chosenFromCache) {
        return { ...chosenFromCache, source: 'cache' };
    }

    const fallback = chooseBestIssue(CURATED_GOOD_FIRST_ISSUES, skills, dsaSignal) || CURATED_GOOD_FIRST_ISSUES[0];
    return fallback
        ? { ...fallback, source: 'curated' }
        : null;
};

export const getMergedPrStreak = (mergedDates = []) => {
    if (!Array.isArray(mergedDates) || mergedDates.length === 0) return 0;
    const dayKeys = Array.from(
        new Set(
            mergedDates
                .map((value) => String(value || '').slice(0, 10))
                .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
        )
    ).sort((a, b) => b.localeCompare(a));

    if (dayKeys.length === 0) return 0;

    let streak = 1;
    let prev = new Date(`${dayKeys[0]}T00:00:00.000Z`);

    for (let i = 1; i < dayKeys.length; i += 1) {
        const current = new Date(`${dayKeys[i]}T00:00:00.000Z`);
        const diffDays = Math.round((prev - current) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            streak += 1;
            prev = current;
        } else {
            break;
        }
    }

    return streak;
};

export const getOssSummaryForUser = async (email) => {
    const connectionResult = await query(`
        SELECT username, avatar_url, last_sync_at, stars_total
        FROM github_connections
        WHERE user_email = $1
        LIMIT 1
    `, [email]);

    const connection = connectionResult.rows[0] || null;
    const statsResult = await query(`
        SELECT
            COUNT(*) as prs_opened,
            SUM(CASE WHEN merged_at IS NOT NULL AND merged_at != '' THEN 1 ELSE 0 END) as prs_merged
        FROM github_pull_requests
        WHERE user_email = $1
    `, [email]);

    const recentResult = await query(`
        SELECT pr_id, repo_full_name, title, state, merged_at, created_at, html_url
        FROM github_pull_requests
        WHERE user_email = $1
        ORDER BY COALESCE(merged_at, created_at) DESC
        LIMIT 10
    `, [email]);

    const mergedDatesResult = await query(`
        SELECT merged_at
        FROM github_pull_requests
        WHERE user_email = $1 AND merged_at IS NOT NULL AND merged_at != ''
        ORDER BY merged_at DESC
    `, [email]);

    const activityResult = await query(`
        SELECT activity_date, prs_opened, prs_merged, stars_gained
        FROM github_contribution_daily
        WHERE user_email = $1
        ORDER BY activity_date ASC
    `, [email]);

    const recommendation = await getIssueRecommendationForUser(email);
    const mergedDates = mergedDatesResult.rows.map((row) => row.merged_at);

    return {
        connected: Boolean(connection),
        username: connection?.username || null,
        avatarUrl: connection?.avatar_url || null,
        lastSyncAt: connection?.last_sync_at || null,
        stars: Number.parseInt(connection?.stars_total, 10) || 0,
        prsOpened: Number.parseInt(statsResult.rows[0]?.prs_opened, 10) || 0,
        prsMerged: Number.parseInt(statsResult.rows[0]?.prs_merged, 10) || 0,
        mergedPrStreak: getMergedPrStreak(mergedDates),
        recentPrs: recentResult.rows.map((row) => ({
            pr_id: Number.parseInt(row.pr_id, 10) || row.pr_id,
            repo_full_name: row.repo_full_name,
            title: row.title,
            state: row.state,
            merged_at: row.merged_at || null,
            created_at: row.created_at || null,
            html_url: row.html_url,
        })),
        activity: activityResult.rows.map((row) => ({
            activity_date: String(row.activity_date || '').slice(0, 10),
            prs_opened: Number.parseInt(row.prs_opened, 10) || 0,
            prs_merged: Number.parseInt(row.prs_merged, 10) || 0,
            stars_gained: Number.parseInt(row.stars_gained, 10) || 0,
        })),
        issueRecommendation: recommendation,
    };
};

export default {
    getIssueRecommendationForUser,
    getMergedPrStreak,
    getOssSummaryForUser,
};
