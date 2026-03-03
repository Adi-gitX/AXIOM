import { query } from '../config/db.js';
import { DSA_TOPICS, DSA_TOTAL_PROBLEMS } from '../data/dsaCatalog.js';

const toDateString = (date = new Date()) => date.toISOString().split('T')[0];
const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const clampDays = (days) => {
    const parsed = toInt(days, 30);
    return Math.min(365, Math.max(1, parsed));
};

/**
 * Get DSA catalog used by tracker UI
 */
export const getDsaCatalog = async (_req, res) => {
    res.json({
        topics: DSA_TOPICS,
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

        res.json({
            progress: {
                ...progress,
                total_problems_solved: toInt(progress.total_problems_solved),
                current_streak: toInt(progress.current_streak),
                longest_streak: toInt(progress.longest_streak),
                total_study_minutes: toInt(progress.total_study_minutes),
            },
            solvedProblems: solvedResult.rows.map((row) => row.problem_id),
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
        const { email, problemId, topicId } = req.body;
        if (!email || !problemId) {
            return res.status(400).json({ error: 'email and problemId are required' });
        }

        const existing = await query(
            'SELECT id FROM solved_problems WHERE user_email = $1 AND problem_id = $2',
            [email, problemId]
        );

        const today = toDateString(new Date());

        if (existing.rows.length > 0) {
            await query(
                'DELETE FROM solved_problems WHERE user_email = $1 AND problem_id = $2',
                [email, problemId]
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
            `, [email, today]);

            return res.json({ solved: false, problemId });
        }

        await query(`
            INSERT INTO solved_problems (user_email, problem_id, topic_id)
            VALUES ($1, $2, $3)
        `, [email, problemId, topicId || null]);

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

        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = toDateString(yesterdayDate);

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

        return res.json({ solved: true, problemId });
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

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - (days - 1));
        const cutoff = toDateString(cutoffDate);

        const result = await query(`
            SELECT
                activity_date,
                problems_solved,
                study_minutes,
                videos_watched,
                messages_sent
            FROM user_activity
            WHERE user_email = $1
              AND activity_date >= $2
            ORDER BY activity_date ASC
        `, [email, cutoff]);

        res.json(result.rows.map((row) => ({
            ...row,
            problems_solved: toInt(row.problems_solved),
            study_minutes: toInt(row.study_minutes),
            videos_watched: toInt(row.videos_watched),
            messages_sent: toInt(row.messages_sent),
        })));
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
