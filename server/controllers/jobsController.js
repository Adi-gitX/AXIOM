import { query } from '../config/db.js';

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeJob = (row) => ({
    ...row,
    id: toInt(row.id),
    is_remote: row.is_remote === true || row.is_remote === 1 || row.is_remote === '1',
    is_active: row.is_active === true || row.is_active === 1 || row.is_active === '1',
});

const shiftParamRefs = (sql, shiftBy) =>
    sql.replace(/\$(\d+)/g, (_match, index) => `$${Number(index) + shiftBy}`);

const isTruthy = (value) =>
    value === true || value === 1 || value === '1' || value === 'true';

const assertJobExistsAndActive = async (jobId) => {
    const result = await query(
        'SELECT id, is_active FROM jobs WHERE id = $1 LIMIT 1',
        [jobId]
    );

    if (result.rows.length === 0) {
        return { ok: false, status: 404, message: 'Job not found' };
    }

    if (!isTruthy(result.rows[0].is_active)) {
        return { ok: false, status: 400, message: 'Job is no longer active' };
    }

    return { ok: true };
};

/**
 * Get all jobs with filtering and pagination
 */
export const getAllJobs = async (req, res) => {
    try {
        const {
            type,
            remote,
            search,
            email,
            limit = 20,
            offset = 0
        } = req.query;

        const safeLimit = Math.min(100, Math.max(1, toInt(limit, 20)));
        const safeOffset = Math.max(0, toInt(offset, 0));

        const where = ['is_active = 1'];
        const params = [];
        let paramIndex = 1;

        if (type && type !== 'All') {
            where.push(`job_type = $${paramIndex++}`);
            params.push(type);
        }

        if (remote === 'true') {
            where.push('is_remote = 1');
        }

        if (search) {
            where.push(`(title LIKE $${paramIndex} OR company LIKE $${paramIndex + 1})`);
            params.push(`%${search}%`, `%${search}%`);
            paramIndex += 2;
        }

        const whereSql = where.join(' AND ');
        const listWhereSql = email ? shiftParamRefs(whereSql, 1) : whereSql;

        const sql = `
            SELECT
                jobs.*,
                ${email ? 'CASE WHEN saved_jobs.id IS NULL THEN 0 ELSE 1 END as is_saved,' : '0 as is_saved,'}
                ${email ? 'CASE WHEN applied_jobs.id IS NULL THEN 0 ELSE 1 END as is_applied' : '0 as is_applied'}
            FROM jobs
            ${email ? 'LEFT JOIN saved_jobs ON saved_jobs.job_id = jobs.id AND saved_jobs.user_email = $1' : ''}
            ${email ? 'LEFT JOIN applied_jobs ON applied_jobs.job_id = jobs.id AND applied_jobs.user_email = $1' : ''}
            WHERE ${listWhereSql}
            ORDER BY posted_at DESC
            LIMIT $${email ? paramIndex + 1 : paramIndex} OFFSET $${email ? paramIndex + 2 : paramIndex + 1}
        `;
        const listParams = email
            ? [email, ...params, safeLimit, safeOffset]
            : [...params, safeLimit, safeOffset];

        const result = await query(sql, listParams);

        const countSql = `
            SELECT COUNT(*) as count
            FROM jobs
            WHERE ${whereSql}
        `;
        const countResult = await query(countSql, params);

        res.json({
            jobs: result.rows.map((row) => ({
                ...normalizeJob(row),
                is_saved: row.is_saved === true || row.is_saved === 1 || row.is_saved === '1',
                is_applied: row.is_applied === true || row.is_applied === 1 || row.is_applied === '1',
            })),
            total: toInt(countResult.rows[0]?.count),
            limit: safeLimit,
            offset: safeOffset
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

        res.json(normalizeJob(result.rows[0]));
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
        const email = req.body.email || req.query.email;
        const jobId = req.body.jobId || req.query.jobId;
        const safeJobId = toInt(jobId);

        if (!email || !safeJobId) {
            return res.status(400).json({ error: 'email and valid jobId are required' });
        }

        const jobCheck = await assertJobExistsAndActive(safeJobId);
        if (!jobCheck.ok) {
            return res.status(jobCheck.status).json({ error: jobCheck.message });
        }

        await query(`
            INSERT INTO saved_jobs (user_email, job_id)
            VALUES ($1, $2)
            ON CONFLICT (user_email, job_id) DO NOTHING
        `, [email, safeJobId]);

        res.json({ saved: true, jobId: safeJobId });
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
        const email = req.body.email || req.query.email;
        const safeJobId = toInt(req.params.jobId);

        if (!email || !safeJobId) {
            return res.status(400).json({ error: 'email and valid jobId are required' });
        }

        await query(`
            DELETE FROM saved_jobs 
            WHERE user_email = $1 AND job_id = $2
        `, [email, safeJobId]);

        res.json({ saved: false, jobId: safeJobId });
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

        res.json(result.rows.map(normalizeJob));
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

        res.json(result.rows.map((r) => toInt(r.job_id)));
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
        const email = req.body.email || req.query.email;
        const jobId = req.body.jobId || req.query.jobId;
        const { notes } = req.body;
        const safeJobId = toInt(jobId);

        if (!email || !safeJobId) {
            return res.status(400).json({ error: 'email and valid jobId are required' });
        }

        const jobCheck = await assertJobExistsAndActive(safeJobId);
        if (!jobCheck.ok) {
            return res.status(jobCheck.status).json({ error: jobCheck.message });
        }

        await query(`
            INSERT INTO applied_jobs (user_email, job_id, notes)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_email, job_id) DO UPDATE SET
                notes = EXCLUDED.notes
        `, [email, safeJobId, notes || null]);

        res.json({ applied: true, jobId: safeJobId });
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

        res.json(result.rows.map(normalizeJob));
    } catch (err) {
        console.error('getAppliedJobs error:', err.message);
        res.status(500).json({ error: 'Failed to get applied jobs' });
    }
};
