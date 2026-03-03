import { query } from '../config/db.js';
import {
    DSA_SHEETS,
    DSA_TOPICS,
    DSA_TOTAL_TOPICS,
    DSA_TOTAL_PROBLEMS,
    canonicalizeProblemId,
    getAliasesForProblemId,
    getProblemMeta,
} from '../data/dsaCatalog.js';

const toDateString = (date = new Date()) => date.toISOString().split('T')[0];
const DEFAULT_TIMEZONE = 'UTC';
const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const clampDays = (days) => {
    const parsed = toInt(days, 30);
    return Math.min(365, Math.max(1, parsed));
};

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

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
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
    if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
    const [year, month, day] = key.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
};

const toDateKeyFromUtcDate = (date) => (
    toDateKeyFromParts(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate())
);

const isDateKeyInRange = (dateKey, fromKey, toKey) => (
    dateKey >= fromKey && dateKey <= toKey
);

const normalizeSolvedProblems = (rows = []) => {
    const uniqueCanonical = new Set();
    const solvedProblems = [];

    for (const row of rows) {
        const canonicalId = canonicalizeProblemId(row.problem_id);
        if (!canonicalId || uniqueCanonical.has(canonicalId)) {
            continue;
        }
        uniqueCanonical.add(canonicalId);
        solvedProblems.push(canonicalId);
    }

    return solvedProblems;
};

/**
 * Get DSA catalog used by tracker UI
 */
export const getDsaCatalog = async (_req, res) => {
    res.json({
        sheets: DSA_SHEETS,
        topics: DSA_TOPICS,
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

        await query(`
            INSERT INTO user_progress (user_email)
            VALUES ($1)
            ON CONFLICT (user_email) DO NOTHING
        `, [email]);

        const progressResult = await query(`
            SELECT
                user_email,
                total_problems_solved,
                current_streak,
                longest_streak,
                total_study_minutes,
                last_activity_date
            FROM user_progress
            WHERE user_email = $1
            LIMIT 1
        `, [email]);

        const solvedResult = await query(`
            SELECT problem_id, topic_id, solved_at
            FROM solved_problems
            WHERE user_email = $1
            ORDER BY solved_at DESC
        `, [email]);

        const progress = progressResult.rows[0] || {
            user_email: email,
            total_problems_solved: 0,
            current_streak: 0,
            longest_streak: 0,
            total_study_minutes: 0,
            last_activity_date: null,
        };

        const solvedProblems = normalizeSolvedProblems(solvedResult.rows);

        res.json({
            progress: {
                ...progress,
                total_problems_solved: solvedProblems.length,
                current_streak: toInt(progress.current_streak),
                longest_streak: toInt(progress.longest_streak),
                total_study_minutes: toInt(progress.total_study_minutes),
            },
            solvedProblems,
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

        const today = toDateKeyInTimeZone(new Date(), requestTimeZone);

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

            const progressResult = await query(`
                SELECT total_problems_solved
                FROM user_progress
                WHERE user_email = $1
                LIMIT 1
            `, [email]);
            const currentTotal = toInt(progressResult.rows[0]?.total_problems_solved);
            const nextTotal = Math.max(0, currentTotal - 1);

            await query(`
                INSERT INTO user_progress (user_email, total_problems_solved)
                VALUES ($1, $2)
                ON CONFLICT (user_email) DO UPDATE SET
                    total_problems_solved = $2
            `, [email, nextTotal]);

            await query(`
                UPDATE user_activity
                SET problems_solved = CASE
                    WHEN problems_solved > 0 THEN problems_solved - 1
                    ELSE 0
                END
                WHERE user_email = $1 AND activity_date = $2
            `, [email, unsolveActivityDay]);

            return res.json({ solved: false, problemId: canonicalProblemId });
        }

        const canonicalMeta = getProblemMeta(canonicalProblemId);
        const fallbackTopicId = Number.isFinite(toInt(topicId, Number.NaN))
            ? toInt(topicId)
            : null;
        const canonicalTopicId = canonicalMeta?.topicId ?? fallbackTopicId;

        await query(`
            INSERT INTO solved_problems (user_email, problem_id, topic_id)
            VALUES ($1, $2, $3)
        `, [email, canonicalProblemId, canonicalTopicId]);

        const progressResult = await query(`
            SELECT
                total_problems_solved,
                current_streak,
                longest_streak,
                last_activity_date
            FROM user_progress
            WHERE user_email = $1
            LIMIT 1
        `, [email]);

        const currentProgress = progressResult.rows[0] || {};
        const currentTotal = toInt(currentProgress.total_problems_solved);
        const currentStreak = toInt(currentProgress.current_streak);
        const longestStreak = toInt(currentProgress.longest_streak);
        const lastActivity = currentProgress.last_activity_date
            ? String(currentProgress.last_activity_date).slice(0, 10)
            : null;

        const todayUtcDate = parseDateKey(today) || new Date();
        const yesterdayDate = new Date(todayUtcDate);
        yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
        const yesterday = toDateKeyFromUtcDate(yesterdayDate);

        let nextStreak = 1;
        if (lastActivity === today) {
            nextStreak = currentStreak || 1;
        } else if (lastActivity === yesterday) {
            nextStreak = currentStreak + 1;
        }

        const nextLongest = Math.max(longestStreak, nextStreak);
        const nextTotal = currentTotal + 1;

        await query(`
            INSERT INTO user_progress (
                user_email,
                total_problems_solved,
                current_streak,
                longest_streak,
                last_activity_date
            )
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_email) DO UPDATE SET
                total_problems_solved = $2,
                current_streak = $3,
                longest_streak = $4,
                last_activity_date = $5
        `, [email, nextTotal, nextStreak, nextLongest, today]);

        await query(`
            INSERT INTO user_activity (user_email, activity_date, problems_solved)
            VALUES ($1, $2, 1)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                problems_solved = user_activity.problems_solved + 1
        `, [email, today]);

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
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue;
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
 * Get dashboard stats
 */
export const getDashboardStats = async (req, res) => {
    try {
        const { email } = req.params;

        const progressResult = await query(`
            SELECT
                total_problems_solved,
                current_streak,
                total_study_minutes
            FROM user_progress
            WHERE user_email = $1
            LIMIT 1
        `, [email]);

        const progress = progressResult.rows[0] || {
            total_problems_solved: 0,
            current_streak: 0,
            total_study_minutes: 0,
        };

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
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const key = toDateString(date);
            weeklyActivity.push(activityByDate.get(key) || 0);
        }

        res.json({
            problemsSolved: toInt(progress.total_problems_solved),
            dayStreak: toInt(progress.current_streak),
            hoursStudied: Math.round(toInt(progress.total_study_minutes) / 60),
            totalProblems: DSA_TOTAL_PROBLEMS,
            weeklyActivity,
        });
    } catch (err) {
        console.error('getDashboardStats error:', err.message);
        res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
};
