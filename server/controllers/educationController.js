import { query } from '../config/db.js';

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
                watch_percentage,
                is_completed,
                last_watched_at
            FROM education_progress
            WHERE user_email = $1
            ORDER BY last_watched_at DESC
        `, [email]);

        res.json(result.rows);
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
        const today = new Date().toISOString().split('T')[0];

        await query(`
            INSERT INTO education_progress (user_email, video_id, topic_id, is_completed, watch_percentage)
            VALUES ($1, $2, $3, true, 100)
            ON CONFLICT (user_email, video_id) DO UPDATE SET
                is_completed = true,
                watch_percentage = 100,
                last_watched_at = NOW()
        `, [email, videoId, topicId]);

        // Update daily activity
        await query(`
            INSERT INTO user_activity (user_email, activity_date, videos_watched)
            VALUES ($1, $2, 1)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                videos_watched = user_activity.videos_watched + 1
        `, [email, today]);

        res.json({ completed: true, videoId });
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
        const { email, videoId, topicId, percentage } = req.body;

        const isCompleted = percentage >= 90;

        await query(`
            INSERT INTO education_progress (user_email, video_id, topic_id, watch_percentage, is_completed)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_email, video_id) DO UPDATE SET
                watch_percentage = GREATEST(education_progress.watch_percentage, $4),
                is_completed = education_progress.is_completed OR $5,
                last_watched_at = NOW()
        `, [email, videoId, topicId, percentage, isCompleted]);

        res.json({
            videoId,
            percentage,
            isCompleted
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
                COUNT(*) as total_watched,
                COUNT(*) FILTER (WHERE is_completed = true) as completed_count
            FROM education_progress
            WHERE user_email = $1
            GROUP BY topic_id
        `, [email]);

        res.json(result.rows);
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
        const { limit = 5 } = req.query;

        const result = await query(`
            SELECT 
                video_id,
                topic_id,
                watch_percentage,
                is_completed,
                last_watched_at
            FROM education_progress
            WHERE user_email = $1 AND watch_percentage > 0
            ORDER BY last_watched_at DESC
            LIMIT $2
        `, [email, parseInt(limit)]);

        res.json(result.rows);
    } catch (err) {
        console.error('getRecentlyWatched error:', err.message);
        res.status(500).json({ error: 'Failed to get recently watched' });
    }
};
