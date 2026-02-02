import { query } from '../config/db.js';

/**
 * Get user progress data
 */
export const getUserProgress = async (req, res) => {
    try {
        const { email } = req.params;

        // Get or create user progress record
        const progressResult = await query(`
            INSERT INTO user_progress (user_email)
            VALUES ($1)
            ON CONFLICT (user_email) DO UPDATE SET updated_at = NOW()
            RETURNING *
        `, [email]);

        // Get solved problems
        const solvedResult = await query(`
            SELECT problem_id, topic_id, solved_at
            FROM solved_problems
            WHERE user_email = $1
            ORDER BY solved_at DESC
        `, [email]);

        res.json({
            progress: progressResult.rows[0],
            solvedProblems: solvedResult.rows.map(r => r.problem_id)
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

        // Check if already solved
        const existing = await query(
            'SELECT id FROM solved_problems WHERE user_email = $1 AND problem_id = $2',
            [email, problemId]
        );

        const today = new Date().toISOString().split('T')[0];

        if (existing.rows.length > 0) {
            // Remove from solved
            await query(
                'DELETE FROM solved_problems WHERE user_email = $1 AND problem_id = $2',
                [email, problemId]
            );

            // Update progress count
            await query(`
                UPDATE user_progress 
                SET total_problems_solved = GREATEST(0, total_problems_solved - 1),
                    updated_at = NOW()
                WHERE user_email = $1
            `, [email]);

            // Update daily activity
            await query(`
                UPDATE user_activity 
                SET problems_solved = GREATEST(0, problems_solved - 1)
                WHERE user_email = $1 AND activity_date = $2
            `, [email, today]);

            res.json({ solved: false, problemId });
        } else {
            // Add to solved
            await query(`
                INSERT INTO solved_problems (user_email, problem_id, topic_id)
                VALUES ($1, $2, $3)
            `, [email, problemId, topicId || null]);

            // Update progress count and streak
            await query(`
                INSERT INTO user_progress (user_email, total_problems_solved, last_activity_date)
                VALUES ($1, 1, CURRENT_DATE)
                ON CONFLICT (user_email) DO UPDATE SET 
                    total_problems_solved = user_progress.total_problems_solved + 1,
                    last_activity_date = CURRENT_DATE,
                    current_streak = CASE 
                        WHEN user_progress.last_activity_date = CURRENT_DATE - INTERVAL '1 day' 
                        THEN user_progress.current_streak + 1
                        WHEN user_progress.last_activity_date = CURRENT_DATE 
                        THEN user_progress.current_streak
                        ELSE 1
                    END,
                    longest_streak = GREATEST(
                        user_progress.longest_streak,
                        CASE 
                            WHEN user_progress.last_activity_date = CURRENT_DATE - INTERVAL '1 day' 
                            THEN user_progress.current_streak + 1
                            WHEN user_progress.last_activity_date = CURRENT_DATE 
                            THEN user_progress.current_streak
                            ELSE 1
                        END
                    ),
                    updated_at = NOW()
            `, [email]);

            // Update daily activity
            await query(`
                INSERT INTO user_activity (user_email, activity_date, problems_solved)
                VALUES ($1, $2, 1)
                ON CONFLICT (user_email, activity_date) DO UPDATE SET
                    problems_solved = user_activity.problems_solved + 1
            `, [email, today]);

            res.json({ solved: true, problemId });
        }
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
        const { days = 30 } = req.query;

        const result = await query(`
            SELECT 
                activity_date,
                problems_solved,
                study_minutes,
                videos_watched,
                messages_sent
            FROM user_activity
            WHERE user_email = $1 
            AND activity_date >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
            ORDER BY activity_date ASC
        `, [email]);

        res.json(result.rows);
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
        const today = new Date().toISOString().split('T')[0];

        // Update user progress
        await query(`
            INSERT INTO user_progress (user_email, total_study_minutes)
            VALUES ($1, $2)
            ON CONFLICT (user_email) DO UPDATE SET
                total_study_minutes = user_progress.total_study_minutes + $2,
                updated_at = NOW()
        `, [email, minutes]);

        // Update daily activity
        await query(`
            INSERT INTO user_activity (user_email, activity_date, study_minutes)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                study_minutes = user_activity.study_minutes + $3
        `, [email, today, minutes]);

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

        // Get user progress
        const progressResult = await query(`
            SELECT 
                total_problems_solved,
                current_streak,
                total_study_minutes
            FROM user_progress
            WHERE user_email = $1
        `, [email]);

        const progress = progressResult.rows[0] || {
            total_problems_solved: 0,
            current_streak: 0,
            total_study_minutes: 0
        };

        // Get weekly activity for chart
        const weeklyResult = await query(`
            SELECT 
                activity_date,
                problems_solved + videos_watched + (study_minutes / 30) as activity_score
            FROM user_activity
            WHERE user_email = $1
            AND activity_date >= CURRENT_DATE - INTERVAL '6 days'
            ORDER BY activity_date ASC
        `, [email]);

        // Fill in missing days
        const weeklyActivity = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const found = weeklyResult.rows.find(r =>
                r.activity_date.toISOString().split('T')[0] === dateStr
            );
            weeklyActivity.push(found ? parseInt(found.activity_score) : 0);
        }

        res.json({
            problemsSolved: progress.total_problems_solved,
            dayStreak: progress.current_streak,
            hoursStudied: Math.round(progress.total_study_minutes / 60),
            weeklyActivity
        });
    } catch (err) {
        console.error('getDashboardStats error:', err.message);
        res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
};
