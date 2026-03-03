import { query } from '../config/db.js';
import {
    TOPICS,
    VIDEOS_BY_TOPIC,
    TRENDING_TAGS,
    POPULAR_TAGS,
    RECENT_TAGS,
} from '../data/educationCatalog.js';

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value) => value === true || value === 1 || value === '1';

const normalizeProgressRow = (row) => {
    const progress = toInt(row.progress ?? row.watch_percentage, 0);
    const completed = toBool(row.completed ?? row.is_completed);
    return {
        ...row,
        progress,
        completed,
        watch_percentage: progress,
        is_completed: completed,
        last_watched: row.last_watched || row.last_watched_at || null,
        last_watched_at: row.last_watched_at || row.last_watched || null,
    };
};

const parsePercentage = (input) => {
    if (typeof input === 'number') return input;
    if (typeof input === 'string') return Number.parseFloat(input);
    if (input && typeof input === 'object') {
        return Number.parseFloat(input.progress ?? input.percentage ?? 0);
    }
    return 0;
};

/**
 * Get education content catalog
 */
export const getEducationCatalog = async (req, res) => {
    try {
        const topicId = req.query.topic;
        if (topicId) {
            const topic = TOPICS.find((item) => item.id === topicId);
            if (!topic) {
                return res.status(404).json({ error: 'Topic not found' });
            }

            return res.json({
                topic,
                videos: VIDEOS_BY_TOPIC[topicId] || [],
            });
        }

        res.json({
            topics: TOPICS,
            videosByTopic: VIDEOS_BY_TOPIC,
            tags: {
                trending: TRENDING_TAGS,
                popular: POPULAR_TAGS,
                recent: RECENT_TAGS,
            },
        });
    } catch (err) {
        console.error('getEducationCatalog error:', err.message);
        res.status(500).json({ error: 'Failed to get education catalog' });
    }
};

/**
 * Get user's education progress
 */
export const getEducationProgress = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await query(`
            SELECT
                video_id,
                topic_id,
                progress,
                completed,
                progress AS watch_percentage,
                completed AS is_completed,
                last_watched,
                last_watched AS last_watched_at
            FROM education_progress
            WHERE user_email = $1
            ORDER BY last_watched DESC
        `, [email]);

        res.json(result.rows.map(normalizeProgressRow));
    } catch (err) {
        console.error('getEducationProgress error:', err.message);
        res.status(500).json({ error: 'Failed to get education progress' });
    }
};

/**
 * Mark a video as watched/completed
 */
export const markVideoWatched = async (req, res) => {
    try {
        const { email, videoId, topicId } = req.body;
        if (!email || !videoId) {
            return res.status(400).json({ error: 'email and videoId are required' });
        }

        const today = new Date().toISOString().split('T')[0];

        await query(`
            INSERT INTO education_progress (user_email, video_id, topic_id, completed, progress, last_watched)
            VALUES ($1, $2, $3, 1, 100, CURRENT_TIMESTAMP)
            ON CONFLICT (user_email, video_id) DO UPDATE SET
                completed = 1,
                progress = 100,
                topic_id = COALESCE($3, education_progress.topic_id),
                last_watched = CURRENT_TIMESTAMP
        `, [email, videoId, topicId || null]);

        await query(`
            INSERT INTO user_activity (user_email, activity_date, videos_watched)
            VALUES ($1, $2, 1)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                videos_watched = user_activity.videos_watched + 1
        `, [email, today]);

        res.json({ completed: true, videoId, progress: 100 });
    } catch (err) {
        console.error('markVideoWatched error:', err.message);
        res.status(500).json({ error: 'Failed to mark video as watched' });
    }
};

/**
 * Update video watch progress (percentage)
 */
export const updateWatchProgress = async (req, res) => {
    try {
        const { email, videoId, topicId, percentage, completed } = req.body;
        if (!email || !videoId) {
            return res.status(400).json({ error: 'email and videoId are required' });
        }

        const parsed = parsePercentage(percentage);
        const clampedPercentage = Number.isFinite(parsed)
            ? Math.max(0, Math.min(100, Math.round(parsed)))
            : 0;

        const completedFromObject =
            percentage && typeof percentage === 'object'
                ? percentage.completed
                : undefined;
        const isCompleted = completedFromObject !== undefined
            ? Boolean(completedFromObject)
            : (completed !== undefined ? Boolean(completed) : clampedPercentage >= 90);

        await query(`
            INSERT INTO education_progress (user_email, video_id, topic_id, progress, completed, last_watched)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            ON CONFLICT (user_email, video_id) DO UPDATE SET
                topic_id = COALESCE($3, education_progress.topic_id),
                progress = MAX(education_progress.progress, $4),
                completed = CASE
                    WHEN education_progress.completed = 1 OR $5 = 1 THEN 1
                    ELSE 0
                END,
                last_watched = CURRENT_TIMESTAMP
        `, [email, videoId, topicId || null, clampedPercentage, isCompleted ? 1 : 0]);

        res.json({
            videoId,
            topicId: topicId || null,
            progress: clampedPercentage,
            completed: isCompleted,
            watch_percentage: clampedPercentage,
            is_completed: isCompleted,
        });
    } catch (err) {
        console.error('updateWatchProgress error:', err.message);
        res.status(500).json({ error: 'Failed to update progress' });
    }
};

/**
 * Get topic progress summary
 */
export const getTopicProgress = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await query(`
            SELECT
                topic_id,
                COUNT(*) AS total_watched,
                SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS completed_count
            FROM education_progress
            WHERE user_email = $1
            GROUP BY topic_id
        `, [email]);

        res.json(result.rows.map((row) => ({
            ...row,
            total_watched: toInt(row.total_watched),
            completed_count: toInt(row.completed_count),
        })));
    } catch (err) {
        console.error('getTopicProgress error:', err.message);
        res.status(500).json({ error: 'Failed to get topic progress' });
    }
};

/**
 * Get recently watched videos
 */
export const getRecentlyWatched = async (req, res) => {
    try {
        const { email } = req.params;
        const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 5)));

        const result = await query(`
            SELECT
                video_id,
                topic_id,
                progress,
                completed,
                progress AS watch_percentage,
                completed AS is_completed,
                last_watched,
                last_watched AS last_watched_at
            FROM education_progress
            WHERE user_email = $1 AND progress > 0
            ORDER BY last_watched DESC
            LIMIT $2
        `, [email, limit]);

        res.json(result.rows.map(normalizeProgressRow));
    } catch (err) {
        console.error('getRecentlyWatched error:', err.message);
        res.status(500).json({ error: 'Failed to get recently watched' });
    }
};
