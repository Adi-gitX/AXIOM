import { query } from '../config/db.js';

/**
 * Get all jobs with filtering and pagination
 */
export const getAllJobs = async (req, res) => {
    try {
        const {
            type,
            remote,
            search,
            limit = 20,
            offset = 0
        } = req.query;

        let sql = `
            SELECT * FROM jobs 
            WHERE is_active = true
        `;
        const params = [];
        let paramIndex = 1;

        // Filter by job type
        if (type && type !== 'All') {
            sql += ` AND job_type = $${paramIndex++}`;
            params.push(type);
        }

        // Filter by remote
        if (remote === 'true') {
            sql += ` AND is_remote = true`;
        }

        // Search by title or company
        if (search) {
            sql += ` AND (title ILIKE $${paramIndex} OR company ILIKE $${paramIndex++})`;
            params.push(`%${search}%`);
        }

        sql += ` ORDER BY posted_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await query(sql, params);

        // Get total count for pagination
        const countResult = await query(
            'SELECT COUNT(*) FROM jobs WHERE is_active = true'
        );

        res.json({
            jobs: result.rows,
            total: parseInt(countResult.rows[0].count),
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('getAllJobs error:', err.message);
        res.status(500).json({ error: 'Failed to get jobs' });
    }
};

/**
 * Get a single job by ID
 */
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM jobs WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('getJobById error:', err.message);
        res.status(500).json({ error: 'Failed to get job' });
    }
};

/**
 * Save a job (bookmark)
 */
export const saveJob = async (req, res) => {
    try {
        const { email, jobId } = req.body;

        await query(`
            INSERT INTO saved_jobs (user_email, job_id)
            VALUES ($1, $2)
            ON CONFLICT (user_email, job_id) DO NOTHING
        `, [email, jobId]);

        res.json({ saved: true, jobId });
    } catch (err) {
        console.error('saveJob error:', err.message);
        res.status(500).json({ error: 'Failed to save job' });
    }
};

/**
 * Unsave a job
 */
export const unsaveJob = async (req, res) => {
    try {
        const { email } = req.body;
        const { jobId } = req.params;

        await query(`
            DELETE FROM saved_jobs 
            WHERE user_email = $1 AND job_id = $2
        `, [email, parseInt(jobId)]);

        res.json({ saved: false, jobId: parseInt(jobId) });
    } catch (err) {
        console.error('unsaveJob error:', err.message);
        res.status(500).json({ error: 'Failed to unsave job' });
    }
};

/**
 * Get user's saved jobs
 */
export const getSavedJobs = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await query(`
            SELECT j.*, sj.saved_at
            FROM saved_jobs sj
            JOIN jobs j ON j.id = sj.job_id
            WHERE sj.user_email = $1
            ORDER BY sj.saved_at DESC
        `, [email]);

        res.json(result.rows);
    } catch (err) {
        console.error('getSavedJobs error:', err.message);
        res.status(500).json({ error: 'Failed to get saved jobs' });
    }
};

/**
 * Get saved job IDs for a user (for quick lookup)
 */
export const getSavedJobIds = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await query(`
            SELECT job_id FROM saved_jobs WHERE user_email = $1
        `, [email]);

        res.json(result.rows.map(r => r.job_id));
    } catch (err) {
        console.error('getSavedJobIds error:', err.message);
        res.status(500).json({ error: 'Failed to get saved job IDs' });
    }
};

/**
 * Track job application
 */
export const applyToJob = async (req, res) => {
    try {
        const { email, jobId, notes } = req.body;

        await query(`
            INSERT INTO applied_jobs (user_email, job_id, notes)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_email, job_id) DO UPDATE SET
                notes = EXCLUDED.notes
        `, [email, jobId, notes || null]);

        res.json({ applied: true, jobId });
    } catch (err) {
        console.error('applyToJob error:', err.message);
        res.status(500).json({ error: 'Failed to track application' });
    }
};

/**
 * Get user's applied jobs
 */
export const getAppliedJobs = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await query(`
            SELECT j.*, aj.applied_at, aj.status, aj.notes
            FROM applied_jobs aj
            JOIN jobs j ON j.id = aj.job_id
            WHERE aj.user_email = $1
            ORDER BY aj.applied_at DESC
        `, [email]);

        res.json(result.rows);
    } catch (err) {
        console.error('getAppliedJobs error:', err.message);
        res.status(500).json({ error: 'Failed to get applied jobs' });
    }
};
