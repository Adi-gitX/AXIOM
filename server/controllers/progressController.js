import { query } from '../config/db.js';
import {
    DSA_SHEETS,
    DSA_TOTAL_TOPICS,
    DSA_TOTAL_PROBLEMS,
    canonicalizeProblemId,
    getAliasesForProblemId,
    getProblemMeta,
} from '../data/dsaCatalog.js';
import { getCompanyTagsForProblem } from '../data/dsaCompanyTags.js';
import { getIssueRecommendationForUser } from '../services/ossService.js';

const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_TIMEZONE = 'UTC';
const DEFAULT_FOCUS_LIMIT = 3;
const MAX_NOTES_LENGTH = 5000;
const SHEET_PRIORITY = ['love450', 'striverSDE', 'striverA2Z'];
const DEFAULT_REVIEW_INTERVAL_DAYS = 1;

const toDateString = (date = new Date()) => date.toISOString().split('T')[0];

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const clampDays = (days) => {
    const parsed = toInt(days, 30);
    return Math.min(365, Math.max(1, parsed));
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const buildInPlaceholders = (startIndex, values) => (
    values.map((_, index) => `$${startIndex + index}`).join(', ')
);

const isValidTimeZone = (timeZone) => {
    if (!timeZone || typeof timeZone !== 'string') return false;
    try {
        new Intl.DateTimeFormat('en-US', { timeZone }).format(new Date());
        return true;
    } catch {
        return false;
    }
};

const resolveTimeZone = (timeZone) => (
    isValidTimeZone(timeZone) ? timeZone : DEFAULT_TIMEZONE
);

const toDateKeyFromParts = (year, month, day) => (
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
);

const toDateKeyInTimeZone = (date = new Date(), timeZone = DEFAULT_TIMEZONE) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const parts = formatter.formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
};

const parseDateLike = (value) => {
    if (!value) return null;
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const raw = String(value).trim();
    if (!raw) return null;

    if (DATE_KEY_RE.test(raw)) {
        const [year, month, day] = raw.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }

    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/.test(raw)) {
        const maybeUtc = new Date(`${raw.replace(' ', 'T')}Z`);
        if (!Number.isNaN(maybeUtc.getTime())) {
            return maybeUtc;
        }
    }

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseDateKey = (key) => {
    if (typeof key !== 'string' || !DATE_KEY_RE.test(key)) return null;
    const [year, month, day] = key.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
};

const toDateKeyFromUtcDate = (date) => (
    toDateKeyFromParts(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate())
);

const addDaysToDateKey = (dateKey, offsetDays) => {
    const base = parseDateKey(dateKey);
    if (!base) return dateKey;
    base.setUTCDate(base.getUTCDate() + offsetDays);
    return toDateKeyFromUtcDate(base);
};

const isDateKeyInRange = (dateKey, fromKey, toKey) => (
    dateKey >= fromKey && dateKey <= toKey
);

const normalizeSolvedProblems = (rows = []) => {
    return getCanonicalSolvedEntries(rows).map((entry) => entry.problemId);
};

const normalizeTopicId = (topicId) => {
    const parsed = Number.parseInt(topicId, 10);
    return Number.isFinite(parsed) ? parsed : null;
};

const normalizeNotes = (notes) => {
    const value = typeof notes === 'string' ? notes.trim() : '';
    return value.slice(0, MAX_NOTES_LENGTH);
};

const getSheetRank = (sheetId) => {
    const index = SHEET_PRIORITY.indexOf(sheetId);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const sortSheetsByPriority = (sheets = []) => (
    [...sheets].sort((a, b) => {
        const rankA = getSheetRank(a.id);
        const rankB = getSheetRank(b.id);
        if (rankA !== rankB) return rankA - rankB;
        return String(a.name || '').localeCompare(String(b.name || ''));
    })
);

const enrichProblem = (problem) => ({
    ...problem,
    company_tags: getCompanyTagsForProblem(problem.id),
});

const ENRICHED_DSA_SHEETS = sortSheetsByPriority(DSA_SHEETS).map((sheet) => ({
    ...sheet,
    topics: (sheet.topics || []).map((topic) => ({
        ...topic,
        problems: (topic.problems || []).map((problem) => enrichProblem(problem)),
    })),
}));

const ENRICHED_DSA_TOPICS = ENRICHED_DSA_SHEETS.flatMap((sheet) => sheet.topics || []);

const getCanonicalJournalRows = (rows = []) => {
    const byCanonical = new Map();

    for (const row of rows) {
        const canonicalId = canonicalizeProblemId(row.problem_id);
        if (!canonicalId) continue;

        const existing = byCanonical.get(canonicalId);
        const existingUpdated = String(existing?.updated_at || existing?.last_attempted_at || '');
        const nextUpdated = String(row?.updated_at || row?.last_attempted_at || '');

        if (!existing || nextUpdated > existingUpdated) {
            byCanonical.set(canonicalId, {
                ...row,
                problem_id: canonicalId,
            });
        }
    }

    return byCanonical;
};

const getCanonicalSolvedEntries = (rows = []) => {
    const byCanonical = new Map();

    for (const row of rows) {
        const canonicalId = canonicalizeProblemId(row.problem_id);
        if (!canonicalId) continue;

        const solvedAt = parseDateLike(row.solved_at) || parseDateLike(row.created_at) || null;
        const solvedAtMs = solvedAt ? solvedAt.getTime() : 0;
        const existing = byCanonical.get(canonicalId);

        if (!existing || solvedAtMs > existing.solvedAtMs) {
            byCanonical.set(canonicalId, {
                problemId: canonicalId,
                solvedAt,
                solvedAtMs,
            });
        }
    }

    return Array.from(byCanonical.values()).sort((a, b) => b.solvedAtMs - a.solvedAtMs);
};

const getUniqueDayKeysFromSolvedEntries = (entries = [], timeZone = DEFAULT_TIMEZONE) => {
    const days = new Set();
    for (const entry of entries) {
        if (!entry?.solvedAt) continue;
        days.add(toDateKeyInTimeZone(entry.solvedAt, timeZone));
    }
    return Array.from(days).sort((a, b) => b.localeCompare(a));
};

const diffDaysBetweenDateKeys = (newerKey, olderKey) => {
    const newer = parseDateKey(newerKey);
    const older = parseDateKey(olderKey);
    if (!newer || !older) return Number.MAX_SAFE_INTEGER;
    return Math.round((newer.getTime() - older.getTime()) / (1000 * 60 * 60 * 24));
};

const computeStreakStats = (dayKeys = [], todayKey = toDateKeyInTimeZone(new Date(), DEFAULT_TIMEZONE)) => {
    if (!Array.isArray(dayKeys) || dayKeys.length === 0) {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
        };
    }

    let longestStreak = 1;
    let rolling = 1;
    for (let i = 1; i < dayKeys.length; i += 1) {
        const diff = diffDaysBetweenDateKeys(dayKeys[i - 1], dayKeys[i]);
        if (diff === 1) {
            rolling += 1;
        } else {
            rolling = 1;
        }
        longestStreak = Math.max(longestStreak, rolling);
    }

    const lastActivityDate = dayKeys[0] || null;
    const yesterdayKey = addDaysToDateKey(todayKey, -1);
    let currentStreak = 0;
    if (lastActivityDate === todayKey || lastActivityDate === yesterdayKey) {
        currentStreak = 1;
        for (let i = 1; i < dayKeys.length; i += 1) {
            const diff = diffDaysBetweenDateKeys(dayKeys[i - 1], dayKeys[i]);
            if (diff === 1) {
                currentStreak += 1;
            } else {
                break;
            }
        }
    }

    return {
        currentStreak,
        longestStreak,
        lastActivityDate,
    };
};

const upsertUserProgressSnapshot = async ({
    email,
    totalSolved,
    currentStreak,
    longestStreak,
    lastActivityDate,
    totalStudyMinutes,
}) => {
    await query(`
        INSERT INTO user_progress (
            user_email,
            total_problems_solved,
            current_streak,
            longest_streak,
            total_study_minutes,
            last_activity_date
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_email) DO UPDATE SET
            total_problems_solved = $2,
            current_streak = $3,
            longest_streak = $4,
            total_study_minutes = $5,
            last_activity_date = $6
    `, [
        email,
        totalSolved,
        currentStreak,
        longestStreak,
        totalStudyMinutes,
        lastActivityDate,
    ]);
};

const syncUserProgressSnapshot = async (email, timeZone = DEFAULT_TIMEZONE) => {
    if (!email) {
        return {
            solvedProblems: [],
            totalProblemsSolved: 0,
            currentStreak: 0,
            longestStreak: 0,
            totalStudyMinutes: 0,
            lastActivityDate: null,
        };
    }

    await query(`
        INSERT INTO user_progress (user_email)
        VALUES ($1)
        ON CONFLICT (user_email) DO NOTHING
    `, [email]);

    const [progressResult, solvedResult] = await Promise.all([
        query(`
            SELECT total_study_minutes
            FROM user_progress
            WHERE user_email = $1
            LIMIT 1
        `, [email]),
        query(`
            SELECT problem_id, solved_at
            FROM solved_problems
            WHERE user_email = $1
            ORDER BY solved_at DESC
        `, [email]),
    ]);

    const totalStudyMinutes = Math.max(0, toInt(progressResult.rows[0]?.total_study_minutes));
    const solvedEntries = getCanonicalSolvedEntries(solvedResult.rows);
    const solvedProblems = solvedEntries.map((entry) => entry.problemId);
    const todayKey = toDateKeyInTimeZone(new Date(), timeZone);
    const dayKeys = getUniqueDayKeysFromSolvedEntries(solvedEntries, timeZone);
    const streak = computeStreakStats(dayKeys, todayKey);

    await upsertUserProgressSnapshot({
        email,
        totalSolved: solvedProblems.length,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityDate: streak.lastActivityDate,
        totalStudyMinutes,
    });

    return {
        solvedProblems,
        totalProblemsSolved: solvedProblems.length,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        totalStudyMinutes,
        lastActivityDate: streak.lastActivityDate,
    };
};

const buildDefaultReviewSeed = (solvedAt, timeZone = DEFAULT_TIMEZONE) => {
    const solvedDate = solvedAt || new Date();
    const solvedDayKey = toDateKeyInTimeZone(solvedDate, timeZone);
    return {
        reviewIntervalDays: DEFAULT_REVIEW_INTERVAL_DAYS,
        reviewDueDate: addDaysToDateKey(solvedDayKey, DEFAULT_REVIEW_INTERVAL_DAYS),
        lastAttemptedAt: solvedDate.toISOString(),
    };
};

const ensureJournalEntryForSolvedProblem = async ({
    email,
    canonicalProblemId,
    solvedAt = new Date(),
    timeZone = DEFAULT_TIMEZONE,
}) => {
    const aliases = getAliasesForProblemId(canonicalProblemId);
    if (!email || aliases.length === 0) return;

    const aliasPlaceholders = buildInPlaceholders(2, aliases);
    const existingResult = await query(`
        SELECT
            problem_id,
            notes,
            time_spent_minutes,
            attempts,
            review_interval_days,
            review_due_date,
            last_attempted_at,
            last_reviewed_at,
            updated_at
        FROM dsa_problem_journal
        WHERE user_email = $1 AND problem_id IN (${aliasPlaceholders})
        ORDER BY updated_at DESC
        LIMIT 1
    `, [email, ...aliases]);

    const existing = existingResult.rows[0] || null;
    const reviewSeed = buildDefaultReviewSeed(solvedAt, timeZone);

    await upsertJournalRow({
        email,
        canonicalProblemId,
        notes: normalizeNotes(existing?.notes),
        timeSpentMinutes: clamp(toInt(existing?.time_spent_minutes, 0), 0, 100000),
        attempts: clamp(Math.max(1, toInt(existing?.attempts, 0)), 1, 100000),
        lastAttemptedAt: existing?.last_attempted_at || reviewSeed.lastAttemptedAt,
        reviewIntervalDays: clamp(toInt(existing?.review_interval_days, reviewSeed.reviewIntervalDays), 1, 120),
        reviewDueDate: DATE_KEY_RE.test(String(existing?.review_due_date || ''))
            ? String(existing.review_due_date)
            : reviewSeed.reviewDueDate,
        lastReviewedAt: existing?.last_reviewed_at || null,
    });
};

const backfillReviewJournalForSolvedProblems = async (email, timeZone = DEFAULT_TIMEZONE) => {
    if (!email) return;

    const [solvedResult, journalResult] = await Promise.all([
        query(`
            SELECT problem_id, solved_at
            FROM solved_problems
            WHERE user_email = $1
            ORDER BY solved_at DESC
        `, [email]),
        query(`
            SELECT problem_id
            FROM dsa_problem_journal
            WHERE user_email = $1
        `, [email]),
    ]);

    const solvedEntries = getCanonicalSolvedEntries(solvedResult.rows);
    if (solvedEntries.length === 0) return;

    const journalCanonicalSet = new Set(
        journalResult.rows
            .map((row) => canonicalizeProblemId(row.problem_id))
            .filter(Boolean)
    );

    for (const entry of solvedEntries) {
        if (journalCanonicalSet.has(entry.problemId)) continue;
        await ensureJournalEntryForSolvedProblem({
            email,
            canonicalProblemId: entry.problemId,
            solvedAt: entry.solvedAt || new Date(),
            timeZone,
        });
    }
};

const upsertJournalRow = async ({
    email,
    canonicalProblemId,
    notes,
    timeSpentMinutes,
    attempts,
    lastAttemptedAt,
    reviewIntervalDays,
    reviewDueDate,
    lastReviewedAt,
}) => {
    await query(`
        INSERT INTO dsa_problem_journal (
            user_email,
            problem_id,
            notes,
            time_spent_minutes,
            attempts,
            last_attempted_at,
            review_interval_days,
            review_due_date,
            last_reviewed_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        ON CONFLICT (user_email, problem_id) DO UPDATE SET
            notes = EXCLUDED.notes,
            time_spent_minutes = EXCLUDED.time_spent_minutes,
            attempts = EXCLUDED.attempts,
            last_attempted_at = EXCLUDED.last_attempted_at,
            review_interval_days = EXCLUDED.review_interval_days,
            review_due_date = EXCLUDED.review_due_date,
            last_reviewed_at = COALESCE(EXCLUDED.last_reviewed_at, dsa_problem_journal.last_reviewed_at),
            updated_at = CURRENT_TIMESTAMP
    `, [
        email,
        canonicalProblemId,
        notes,
        timeSpentMinutes,
        attempts,
        lastAttemptedAt,
        reviewIntervalDays,
        reviewDueDate,
        lastReviewedAt,
    ]);

    const aliases = getAliasesForProblemId(canonicalProblemId).filter((id) => id !== canonicalProblemId);
    if (aliases.length > 0) {
        const placeholders = buildInPlaceholders(2, aliases);
        await query(`
            DELETE FROM dsa_problem_journal
            WHERE user_email = $1 AND problem_id IN (${placeholders})
        `, [email, ...aliases]);
    }

    const result = await query(`
        SELECT
            problem_id,
            notes,
            time_spent_minutes,
            attempts,
            review_interval_days,
            review_due_date,
            last_attempted_at,
            last_reviewed_at,
            updated_at
        FROM dsa_problem_journal
        WHERE user_email = $1 AND problem_id = $2
        LIMIT 1
    `, [email, canonicalProblemId]);

    return result.rows[0] || null;
};

const getFocusCandidates = ({ solvedSet, max = DEFAULT_FOCUS_LIMIT }) => {
    const candidates = [];

    for (const sheet of ENRICHED_DSA_SHEETS) {
        for (const topic of sheet.topics || []) {
            const topicTotal = topic.total || (topic.problems || []).length;
            const topicSolved = (topic.problems || []).reduce(
                (sum, problem) => sum + (solvedSet.has(problem.id) ? 1 : 0),
                0
            );
            const completion = topicTotal > 0 ? (topicSolved / topicTotal) : 0;

            for (const problem of topic.problems || []) {
                if (solvedSet.has(problem.id)) continue;
                candidates.push({
                    sheet,
                    topic,
                    problem,
                    completion,
                });
            }
        }
    }

    candidates.sort((a, b) => {
        const sheetRankDiff = getSheetRank(a.sheet.id) - getSheetRank(b.sheet.id);
        if (sheetRankDiff !== 0) return sheetRankDiff;
        if (a.completion !== b.completion) return a.completion - b.completion;
        const posA = Number.isFinite(a.topic.position) ? a.topic.position : 0;
        const posB = Number.isFinite(b.topic.position) ? b.topic.position : 0;
        if (posA !== posB) return posA - posB;
        return String(a.problem.title || '').localeCompare(String(b.problem.title || ''));
    });

    return candidates.slice(0, max).map((item) => ({
        id: item.problem.id,
        title: item.problem.title,
        difficulty: item.problem.difficulty,
        external_url: item.problem.external_url,
        source_platform: item.problem.source_platform,
        company_tags: item.problem.company_tags || [],
        sheetId: item.sheet.id,
        sheetName: item.sheet.name,
        topicId: item.topic.id,
        topicName: item.topic.name,
    }));
};

/**
 * Get DSA catalog used by tracker UI
 */
export const getDsaCatalog = async (_req, res) => {
    res.json({
        sheets: ENRICHED_DSA_SHEETS,
        topics: ENRICHED_DSA_TOPICS,
        totalTopics: DSA_TOTAL_TOPICS,
        totalProblems: DSA_TOTAL_PROBLEMS,
    });
};

/**
 * Get user progress data
 */
export const getUserProgress = async (req, res) => {
    try {
        const { email } = req.params;
        const requestTimeZone = resolveTimeZone(req.query.tz);
        const snapshot = await syncUserProgressSnapshot(email, requestTimeZone);

        res.json({
            progress: {
                user_email: email,
                total_problems_solved: snapshot.totalProblemsSolved,
                current_streak: snapshot.currentStreak,
                longest_streak: snapshot.longestStreak,
                total_study_minutes: snapshot.totalStudyMinutes,
                last_activity_date: snapshot.lastActivityDate,
            },
            solvedProblems: snapshot.solvedProblems,
        });
    } catch (err) {
        console.error('getUserProgress error:', err.message);
        res.status(500).json({ error: 'Failed to get progress' });
    }
};

/**
 * Toggle a problem as solved/unsolved
 */
export const toggleProblem = async (req, res) => {
    try {
        const { email, problemId, topicId, tz } = req.body;
        const canonicalProblemId = canonicalizeProblemId(problemId);
        if (!email || !canonicalProblemId) {
            return res.status(400).json({ error: 'email and valid problemId are required' });
        }
        const requestTimeZone = resolveTimeZone(tz || req.query?.tz);

        const aliases = getAliasesForProblemId(canonicalProblemId);
        const aliasPlaceholders = buildInPlaceholders(2, aliases);

        const existing = await query(
            `SELECT id, problem_id, solved_at
             FROM solved_problems
             WHERE user_email = $1 AND problem_id IN (${aliasPlaceholders})
             ORDER BY solved_at DESC`,
            [email, ...aliases]
        );

        const now = new Date();
        const today = toDateKeyInTimeZone(now, requestTimeZone);

        if (existing.rows.length > 0) {
            const unsolveDate = parseDateLike(existing.rows[0]?.solved_at);
            const unsolveActivityDay = unsolveDate
                ? toDateKeyInTimeZone(unsolveDate, requestTimeZone)
                : today;

            await query(
                `DELETE FROM solved_problems
                 WHERE user_email = $1 AND problem_id IN (${aliasPlaceholders})`,
                [email, ...aliases]
            );

            await query(`
                UPDATE user_activity
                SET problems_solved = CASE
                    WHEN problems_solved > 0 THEN problems_solved - 1
                    ELSE 0
                END
                WHERE user_email = $1 AND activity_date = $2
            `, [email, unsolveActivityDay]);

            await query(
                `DELETE FROM dsa_problem_journal
                 WHERE user_email = $1 AND problem_id IN (${aliasPlaceholders})`,
                [email, ...aliases]
            );

            await syncUserProgressSnapshot(email, requestTimeZone);

            return res.json({ solved: false, problemId: canonicalProblemId });
        }

        const canonicalMeta = getProblemMeta(canonicalProblemId);
        const fallbackTopicId = normalizeTopicId(topicId);
        const canonicalTopicId = canonicalMeta?.topicId ?? fallbackTopicId;

        await query(`
            INSERT INTO solved_problems (user_email, problem_id, topic_id)
            VALUES ($1, $2, $3)
        `, [email, canonicalProblemId, canonicalTopicId]);

        await query(`
            INSERT INTO user_activity (user_email, activity_date, problems_solved)
            VALUES ($1, $2, 1)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                problems_solved = user_activity.problems_solved + 1
        `, [email, today]);

        await ensureJournalEntryForSolvedProblem({
            email,
            canonicalProblemId,
            solvedAt: now,
            timeZone: requestTimeZone,
        });

        await syncUserProgressSnapshot(email, requestTimeZone);

        return res.json({ solved: true, problemId: canonicalProblemId });
    } catch (err) {
        console.error('toggleProblem error:', err.message);
        res.status(500).json({ error: 'Failed to toggle problem' });
    }
};

/**
 * Get activity heatmap data
 */
export const getActivityHeatmap = async (req, res) => {
    try {
        const { email } = req.params;
        const days = clampDays(req.query.days);
        const requestTimeZone = resolveTimeZone(req.query.tz);

        const todayKey = toDateKeyInTimeZone(new Date(), requestTimeZone);
        const todayDate = parseDateKey(todayKey) || new Date();
        const cutoffDate = new Date(todayDate);
        cutoffDate.setUTCDate(cutoffDate.getUTCDate() - (days - 1));
        const cutoff = toDateKeyFromUtcDate(cutoffDate);

        const rowsByDate = new Map();
        const ensureRow = (dateKey) => {
            const current = rowsByDate.get(dateKey);
            if (current) {
                return current;
            }

            const created = {
                activity_date: dateKey,
                problems_solved: 0,
                study_minutes: 0,
                videos_watched: 0,
                messages_sent: 0,
            };
            rowsByDate.set(dateKey, created);
            return created;
        };

        const solvedResult = await query(`
            SELECT solved_at
            FROM solved_problems
            WHERE user_email = $1
            ORDER BY solved_at ASC
        `, [email]);

        for (const row of solvedResult.rows) {
            const solvedAt = parseDateLike(row.solved_at);
            if (!solvedAt) continue;

            const dateKey = toDateKeyInTimeZone(solvedAt, requestTimeZone);
            if (!isDateKeyInRange(dateKey, cutoff, todayKey)) continue;

            const day = ensureRow(dateKey);
            day.problems_solved += 1;
        }

        const activityResult = await query(`
            SELECT
                activity_date,
                study_minutes,
                videos_watched,
                messages_sent
            FROM user_activity
            WHERE user_email = $1
              AND activity_date >= $2
              AND activity_date <= $3
            ORDER BY activity_date ASC
        `, [email, cutoff, todayKey]);

        for (const row of activityResult.rows) {
            const dateKey = String(row.activity_date || '').slice(0, 10);
            if (!DATE_KEY_RE.test(dateKey)) continue;
            if (!isDateKeyInRange(dateKey, cutoff, todayKey)) continue;

            const day = ensureRow(dateKey);
            day.study_minutes += toInt(row.study_minutes);
            day.videos_watched += toInt(row.videos_watched);
            day.messages_sent += toInt(row.messages_sent);
        }

        const normalizedRows = Array.from(rowsByDate.values()).sort((a, b) => (
            a.activity_date.localeCompare(b.activity_date)
        ));

        res.json({
            timezone: requestTimeZone,
            from: cutoff,
            to: todayKey,
            rows: normalizedRows,
        });
    } catch (err) {
        console.error('getActivityHeatmap error:', err.message);
        res.status(500).json({ error: 'Failed to get activity' });
    }
};

/**
 * Log study time
 */
export const logStudyTime = async (req, res) => {
    try {
        const { email, minutes } = req.body;
        const parsedMinutes = Math.max(0, toInt(minutes));
        if (!email || parsedMinutes <= 0) {
            return res.status(400).json({ error: 'email and positive minutes are required' });
        }

        const today = toDateString(new Date());

        await query(`
            INSERT INTO user_progress (user_email, total_study_minutes)
            VALUES ($1, $2)
            ON CONFLICT (user_email) DO UPDATE SET
                total_study_minutes = user_progress.total_study_minutes + $2
        `, [email, parsedMinutes]);

        await query(`
            INSERT INTO user_activity (user_email, activity_date, study_minutes)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                study_minutes = user_activity.study_minutes + $3
        `, [email, today, parsedMinutes]);

        res.json({ success: true });
    } catch (err) {
        console.error('logStudyTime error:', err.message);
        res.status(500).json({ error: 'Failed to log study time' });
    }
};

/**
 * Dashboard summary
 */
export const getDashboardStats = async (req, res) => {
    try {
        const { email } = req.params;
        const requestTimeZone = resolveTimeZone(req.query.tz);
        const snapshot = await syncUserProgressSnapshot(email, requestTimeZone);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6);
        const cutoff = toDateString(startDate);

        const weeklyResult = await query(`
            SELECT
                activity_date,
                problems_solved,
                videos_watched,
                study_minutes
            FROM user_activity
            WHERE user_email = $1
              AND activity_date >= $2
            ORDER BY activity_date ASC
        `, [email, cutoff]);

        const activityByDate = new Map();
        for (const row of weeklyResult.rows) {
            const key = String(row.activity_date).slice(0, 10);
            const score =
                toInt(row.problems_solved) +
                toInt(row.videos_watched) +
                Math.floor(toInt(row.study_minutes) / 30);
            activityByDate.set(key, score);
        }

        const weeklyActivity = [];
        for (let i = 6; i >= 0; i -= 1) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = toDateString(date);
            weeklyActivity.push(activityByDate.get(key) || 0);
        }

        const solved = snapshot.totalProblemsSolved;

        res.json({
            problemsSolved: solved,
            dayStreak: snapshot.currentStreak,
            hoursStudied: Math.round(snapshot.totalStudyMinutes / 60),
            totalProblems: DSA_TOTAL_PROBLEMS,
            completionPercentage: DSA_TOTAL_PROBLEMS > 0
                ? Math.round((solved / DSA_TOTAL_PROBLEMS) * 100)
                : 0,
            weeklyActivity,
        });
    } catch (err) {
        console.error('getDashboardStats error:', err.message);
        res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
};

/**
 * Daily focus for dashboard command center
 */
export const getDailyFocus = async (req, res) => {
    try {
        const { email } = req.params;
        const requestedLimit = clamp(toInt(req.query.limit, DEFAULT_FOCUS_LIMIT), 1, 25);
        const requestTimeZone = resolveTimeZone(req.query.tz);

        const userResult = await query(`
            SELECT is_pro
            FROM users
            WHERE email = $1
            LIMIT 1
        `, [email]);
        const isPro = toInt(userResult.rows?.[0]?.is_pro, 0) > 0;
        const maxAllowed = isPro ? 25 : DEFAULT_FOCUS_LIMIT;
        const appliedLimit = clamp(requestedLimit, 1, maxAllowed);

        const solvedResult = await query(`
            SELECT problem_id
            FROM solved_problems
            WHERE user_email = $1
            ORDER BY solved_at DESC
        `, [email]);

        const solvedSet = new Set(normalizeSolvedProblems(solvedResult.rows));
        const focusProblems = getFocusCandidates({ solvedSet, max: appliedLimit });
        const recommendation = await getIssueRecommendationForUser(email).catch(() => null);

        res.json({
            date: toDateKeyInTimeZone(new Date(), requestTimeZone),
            timezone: requestTimeZone,
            appliedLimit,
            focusProblems,
            issueRecommendation: recommendation,
        });
    } catch (err) {
        console.error('getDailyFocus error:', err.message);
        res.status(500).json({ error: 'Failed to get daily focus' });
    }
};

/**
 * Get per-problem notes/time metadata
 */
export const getProblemMetaForUser = async (req, res) => {
    try {
        const { email } = req.params;
        const { sheetId } = req.query;

        const rowsResult = await query(`
            SELECT
                problem_id,
                notes,
                time_spent_minutes,
                attempts,
                review_interval_days,
                review_due_date,
                last_attempted_at,
                last_reviewed_at,
                updated_at
            FROM dsa_problem_journal
            WHERE user_email = $1
            ORDER BY updated_at DESC
        `, [email]);

        const canonicalRows = getCanonicalJournalRows(rowsResult.rows);
        const metaByProblemId = {};

        for (const [canonicalId, row] of canonicalRows.entries()) {
            const catalogMeta = getProblemMeta(canonicalId);
            if (!catalogMeta) continue;
            if (sheetId && catalogMeta.sheetId !== sheetId) continue;

            metaByProblemId[canonicalId] = {
                problemId: canonicalId,
                notes: row.notes || '',
                timeSpentMinutes: toInt(row.time_spent_minutes),
                attempts: toInt(row.attempts),
                reviewIntervalDays: clamp(toInt(row.review_interval_days, 1), 1, 120),
                reviewDueDate: DATE_KEY_RE.test(String(row.review_due_date || '')) ? row.review_due_date : null,
                lastAttemptedAt: row.last_attempted_at || null,
                lastReviewedAt: row.last_reviewed_at || null,
                companyTags: getCompanyTagsForProblem(canonicalId),
            };
        }

        res.json({ metaByProblemId });
    } catch (err) {
        console.error('getProblemMetaForUser error:', err.message);
        res.status(500).json({ error: 'Failed to load problem metadata' });
    }
};

/**
 * Upsert per-problem notes/time metadata
 */
export const upsertProblemMetaForUser = async (req, res) => {
    try {
        const {
            email,
            problemId,
            notes,
            timeSpentMinutes,
            attempts,
            reviewIntervalDays,
            reviewDueDate,
            lastAttemptedAt,
            lastReviewedAt,
            tz,
        } = req.body;

        const canonicalId = canonicalizeProblemId(problemId);
        if (!email || !canonicalId) {
            return res.status(400).json({ error: 'email and valid problemId are required' });
        }

        const requestTimeZone = resolveTimeZone(tz || req.query?.tz);
        const aliases = getAliasesForProblemId(canonicalId);
        const aliasPlaceholders = buildInPlaceholders(2, aliases);
        const existingResult = await query(`
            SELECT
                problem_id,
                time_spent_minutes,
                updated_at
            FROM dsa_problem_journal
            WHERE user_email = $1 AND problem_id IN (${aliasPlaceholders})
            ORDER BY updated_at DESC
            LIMIT 1
        `, [email, ...aliases]);

        const previousTimeSpent = clamp(
            toInt(existingResult.rows[0]?.time_spent_minutes, 0),
            0,
            100000
        );

        const normalizedAttempts = clamp(toInt(attempts, 0), 0, 100000);
        const normalizedTime = clamp(toInt(timeSpentMinutes, 0), 0, 100000);
        const normalizedInterval = clamp(toInt(reviewIntervalDays, 1), 1, 120);
        const normalizedDueDate = DATE_KEY_RE.test(String(reviewDueDate || ''))
            ? String(reviewDueDate)
            : addDaysToDateKey(toDateKeyInTimeZone(new Date(), requestTimeZone), normalizedInterval);

        const normalizedRow = await upsertJournalRow({
            email,
            canonicalProblemId: canonicalId,
            notes: normalizeNotes(notes),
            timeSpentMinutes: normalizedTime,
            attempts: normalizedAttempts,
            lastAttemptedAt: lastAttemptedAt || new Date().toISOString(),
            reviewIntervalDays: normalizedInterval,
            reviewDueDate: normalizedDueDate,
            lastReviewedAt: lastReviewedAt || null,
        });

        const timeDeltaMinutes = normalizedTime - previousTimeSpent;
        if (timeDeltaMinutes !== 0) {
            await query(`
                INSERT INTO user_progress (user_email, total_study_minutes)
                VALUES ($1, CASE WHEN $2 > 0 THEN $2 ELSE 0 END)
                ON CONFLICT (user_email) DO UPDATE SET
                    total_study_minutes = CASE
                        WHEN user_progress.total_study_minutes + $2 < 0 THEN 0
                        ELSE user_progress.total_study_minutes + $2
                    END
            `, [email, timeDeltaMinutes]);

            const activityDay = toDateKeyInTimeZone(new Date(), requestTimeZone);
            await query(`
                INSERT INTO user_activity (user_email, activity_date, study_minutes)
                VALUES ($1, $2, 0)
                ON CONFLICT (user_email, activity_date) DO NOTHING
            `, [email, activityDay]);

            await query(`
                UPDATE user_activity
                SET study_minutes = CASE
                    WHEN study_minutes + $3 < 0 THEN 0
                    ELSE study_minutes + $3
                END
                WHERE user_email = $1 AND activity_date = $2
            `, [email, activityDay, timeDeltaMinutes]);
        }

        res.json({
            problemId: canonicalId,
            timeDeltaMinutes,
            meta: normalizedRow
                ? {
                    problemId: canonicalId,
                    notes: normalizedRow.notes || '',
                    timeSpentMinutes: toInt(normalizedRow.time_spent_minutes),
                    attempts: toInt(normalizedRow.attempts),
                    reviewIntervalDays: clamp(toInt(normalizedRow.review_interval_days, 1), 1, 120),
                    reviewDueDate: DATE_KEY_RE.test(String(normalizedRow.review_due_date || ''))
                        ? normalizedRow.review_due_date
                        : null,
                    lastAttemptedAt: normalizedRow.last_attempted_at || null,
                    lastReviewedAt: normalizedRow.last_reviewed_at || null,
                    companyTags: getCompanyTagsForProblem(canonicalId),
                }
                : null,
        });
    } catch (err) {
        console.error('upsertProblemMetaForUser error:', err.message);
        res.status(500).json({ error: 'Failed to save problem metadata' });
    }
};

/**
 * Mark review completed and schedule next review
 */
export const completeProblemReview = async (req, res) => {
    try {
        const { email, problemId, rating, tz } = req.body;
        const canonicalId = canonicalizeProblemId(problemId);
        if (!email || !canonicalId) {
            return res.status(400).json({ error: 'email and valid problemId are required' });
        }

        const requestTimeZone = resolveTimeZone(tz || req.query?.tz);
        const todayKey = toDateKeyInTimeZone(new Date(), requestTimeZone);
        const grade = String(rating || 'good').toLowerCase();
        const multiplier = {
            again: 1,
            hard: 2,
            good: 3,
            easy: 5,
        }[grade] || 3;

        const aliases = getAliasesForProblemId(canonicalId);
        const aliasPlaceholders = buildInPlaceholders(2, aliases);
        const existing = await query(`
            SELECT
                problem_id,
                notes,
                time_spent_minutes,
                attempts,
                review_interval_days,
                review_due_date,
                last_attempted_at,
                last_reviewed_at,
                updated_at
            FROM dsa_problem_journal
            WHERE user_email = $1 AND problem_id IN (${aliasPlaceholders})
            ORDER BY updated_at DESC
            LIMIT 1
        `, [email, ...aliases]);

        const row = existing.rows[0] || {};
        const currentInterval = clamp(toInt(row.review_interval_days, 1), 1, 120);
        const nextInterval = clamp(currentInterval * multiplier, 1, 120);
        const nextDueDate = addDaysToDateKey(todayKey, nextInterval);

        const normalizedRow = await upsertJournalRow({
            email,
            canonicalProblemId: canonicalId,
            notes: normalizeNotes(row.notes),
            timeSpentMinutes: clamp(toInt(row.time_spent_minutes, 0), 0, 100000),
            attempts: clamp(toInt(row.attempts, 0) + 1, 0, 100000),
            lastAttemptedAt: row.last_attempted_at || new Date().toISOString(),
            reviewIntervalDays: nextInterval,
            reviewDueDate: nextDueDate,
            lastReviewedAt: new Date().toISOString(),
        });

        res.json({
            problemId: canonicalId,
            reviewIntervalDays: nextInterval,
            reviewDueDate: nextDueDate,
            meta: normalizedRow,
        });
    } catch (err) {
        console.error('completeProblemReview error:', err.message);
        res.status(500).json({ error: 'Failed to complete review' });
    }
};

/**
 * Review queue due today
 */
export const getReviewToday = async (req, res) => {
    try {
        const { email } = req.params;
        const { sheetId } = req.query;
        const daysAhead = clamp(toInt(req.query.daysAhead, 0), 0, 14);
        const limit = clamp(toInt(req.query.limit, 30), 1, 200);
        const requestTimeZone = resolveTimeZone(req.query.tz);

        const todayKey = toDateKeyInTimeZone(new Date(), requestTimeZone);
        const dueUntilKey = addDaysToDateKey(todayKey, daysAhead);

        await backfillReviewJournalForSolvedProblems(email, requestTimeZone);

        const solvedRowsResult = await query(`
            SELECT problem_id
            FROM solved_problems
            WHERE user_email = $1
            ORDER BY solved_at DESC
        `, [email]);
        const solvedSet = new Set(normalizeSolvedProblems(solvedRowsResult.rows));

        const journalResult = await query(`
            SELECT
                problem_id,
                notes,
                time_spent_minutes,
                attempts,
                review_interval_days,
                review_due_date,
                last_attempted_at,
                last_reviewed_at,
                updated_at
            FROM dsa_problem_journal
            WHERE user_email = $1
              AND (
                review_due_date IS NULL
                OR review_due_date <= $2
              )
            ORDER BY review_due_date ASC, updated_at DESC
            LIMIT $3
        `, [email, dueUntilKey, limit * 3]);

        const canonicalRows = getCanonicalJournalRows(journalResult.rows);
        const items = [];

        for (const [canonicalId, row] of canonicalRows.entries()) {
            if (!solvedSet.has(canonicalId)) continue;

            const catalogMeta = getProblemMeta(canonicalId);
            if (!catalogMeta) continue;
            if (sheetId && catalogMeta.sheetId !== sheetId) continue;

            const dueDate = DATE_KEY_RE.test(String(row.review_due_date || ''))
                ? String(row.review_due_date)
                : todayKey;

            items.push({
                problemId: canonicalId,
                title: catalogMeta.problem?.title || canonicalId,
                sheetId: catalogMeta.sheetId,
                sheetName: catalogMeta.sheet?.name || '',
                topicId: catalogMeta.topicId,
                topicName: catalogMeta.topic?.name || '',
                difficulty: catalogMeta.problem?.difficulty || 'Unknown',
                external_url: catalogMeta.problem?.external_url || '',
                companyTags: getCompanyTagsForProblem(canonicalId),
                notes: row.notes || '',
                timeSpentMinutes: toInt(row.time_spent_minutes),
                attempts: toInt(row.attempts),
                reviewIntervalDays: clamp(toInt(row.review_interval_days, 1), 1, 120),
                reviewDueDate: dueDate,
                isDue: dueDate <= todayKey,
            });
        }

        items.sort((a, b) => {
            if (a.reviewDueDate !== b.reviewDueDate) {
                return a.reviewDueDate.localeCompare(b.reviewDueDate);
            }
            const sheetRankDiff = getSheetRank(a.sheetId) - getSheetRank(b.sheetId);
            if (sheetRankDiff !== 0) return sheetRankDiff;
            return String(a.title || '').localeCompare(String(b.title || ''));
        });

        res.json({
            date: todayKey,
            timezone: requestTimeZone,
            total: items.length,
            items: items.slice(0, limit),
        });
    } catch (err) {
        console.error('getReviewToday error:', err.message);
        res.status(500).json({ error: 'Failed to load review queue' });
    }
};

export default {
    getDsaCatalog,
    getUserProgress,
    toggleProblem,
    getActivityHeatmap,
    logStudyTime,
    getDashboardStats,
    getDailyFocus,
    getProblemMetaForUser,
    upsertProblemMetaForUser,
    completeProblemReview,
    getReviewToday,
};
