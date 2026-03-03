import { query } from '../config/db.js';
import { INTERVIEW_RESOURCES_SEED, INTERVIEW_TIPS } from '../data/interviewResources.js';

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

let seedPromise = null;

const ensureInterviewSeedData = async () => {
    if (seedPromise) {
        await seedPromise;
        return;
    }

    seedPromise = (async () => {
        const countResult = await query('SELECT COUNT(*) as count FROM interview_resources');
        const count = toInt(countResult.rows[0]?.count, 0);
        if (count > 0) return;

        for (let i = 0; i < INTERVIEW_RESOURCES_SEED.length; i++) {
            const resource = INTERVIEW_RESOURCES_SEED[i];
            await query(`
                INSERT INTO interview_resources (
                    category,
                    title,
                    description,
                    difficulty,
                    content_url,
                    sort_order,
                    is_active
                )
                VALUES ($1, $2, $3, $4, $5, $6, 1)
            `, [
                resource.category,
                resource.title,
                resource.description,
                resource.difficulty,
                resource.content_url || null,
                i + 1,
            ]);
        }
    })();

    try {
        await seedPromise;
    } finally {
        seedPromise = null;
    }
};

const normalizeResource = (row) => ({
    id: toInt(row.id),
    category: row.category,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty || 'Beginner',
    content_url: row.content_url || '',
    is_active: row.is_active === 1 || row.is_active === true || row.is_active === '1',
    sort_order: toInt(row.sort_order),
});

/**
 * Get interview resources with optional category/email filters
 */
export const getInterviewResources = async (req, res) => {
    try {
        await ensureInterviewSeedData();

        const { category = 'All', email } = req.query;
        const params = [];
        let sql = `
            SELECT id, category, title, description, difficulty, content_url, sort_order, is_active
            FROM interview_resources
            WHERE is_active = 1
        `;

        if (category && category !== 'All') {
            sql += ' AND category = $1';
            params.push(category);
        }

        sql += ' ORDER BY category ASC, sort_order ASC, id ASC';

        const result = await query(sql, params);
        const resources = result.rows.map(normalizeResource);
        const categories = ['All', ...new Set(resources.map((r) => r.category))];

        let completedResourceIds = [];
        if (email) {
            const progressResult = await query(`
                SELECT resource_id
                FROM user_interview_progress
                WHERE user_email = $1 AND completed = 1
            `, [email]);
            completedResourceIds = progressResult.rows.map((row) => toInt(row.resource_id)).filter(Boolean);
        }

        const completedSet = new Set(completedResourceIds);
        const hydratedResources = resources.map((resource) => ({
            ...resource,
            completed: completedSet.has(resource.id),
        }));

        res.json({
            resources: hydratedResources,
            categories,
            tips: INTERVIEW_TIPS,
            completedResourceIds,
        });
    } catch (err) {
        console.error('getInterviewResources error:', err.message);
        res.status(500).json({ error: 'Failed to fetch interview resources' });
    }
};

/**
 * Get user's interview progress
 */
export const getInterviewProgress = async (req, res) => {
    try {
        const { email } = req.params;
        const result = await query(`
            SELECT resource_id, completed, notes, completed_at
            FROM user_interview_progress
            WHERE user_email = $1
            ORDER BY completed_at DESC
        `, [email]);

        res.json(result.rows.map((row) => ({
            resource_id: toInt(row.resource_id),
            completed: row.completed === 1 || row.completed === true || row.completed === '1',
            notes: row.notes || '',
            completed_at: row.completed_at || null,
        })));
    } catch (err) {
        console.error('getInterviewProgress error:', err.message);
        res.status(500).json({ error: 'Failed to fetch interview progress' });
    }
};

/**
 * Mark/unmark a resource as completed
 */
export const setInterviewResourceCompletion = async (req, res) => {
    try {
        const resourceId = toInt(req.params.id);
        const { email, completed = true, notes } = req.body;

        if (!email || !resourceId) {
            return res.status(400).json({ error: 'email and valid resource id are required' });
        }

        const exists = await query('SELECT id FROM interview_resources WHERE id = $1 AND is_active = 1', [resourceId]);
        if (exists.rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        const completedFlag = completed ? 1 : 0;

        await query(`
            INSERT INTO user_interview_progress (user_email, resource_id, completed, notes, completed_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            ON CONFLICT (user_email, resource_id) DO UPDATE SET
                completed = $3,
                notes = COALESCE($4, user_interview_progress.notes),
                completed_at = CURRENT_TIMESTAMP
        `, [email, resourceId, completedFlag, notes || null]);

        res.json({
            resource_id: resourceId,
            completed: completedFlag === 1,
        });
    } catch (err) {
        console.error('setInterviewResourceCompletion error:', err.message);
        res.status(500).json({ error: 'Failed to update interview resource progress' });
    }
};
