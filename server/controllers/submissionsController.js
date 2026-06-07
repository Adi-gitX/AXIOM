import { query } from '../config/db.js';

const VALID_STATUS = new Set(['accepted', 'wrong_answer', 'runtime_error', 'error']);
const MAX_CODE_CHARS = 20000;

/**
 * POST /api/submissions
 * Record a Code Lab solution attempt. Body: { problemId, language, code, status,
 * passed, total, runtimeMs }. email is injected by requireVerifiedUser.
 */
export const createSubmission = async (req, res) => {
    try {
        const email = req.authEmail || req.body?.email;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });

        const { problemId, language, code, status, passed = 0, total = 0, runtimeMs = null } = req.body || {};
        if (!problemId || !language || !code) {
            return res.status(400).json({ error: 'problemId, language and code are required.' });
        }
        const safeStatus = VALID_STATUS.has(status) ? status : 'error';
        const result = await query(
            `INSERT INTO code_submissions (user_email, problem_id, language, code, status, passed, total, runtime_ms)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                email,
                String(problemId),
                String(language),
                String(code).slice(0, MAX_CODE_CHARS),
                safeStatus,
                Number.isFinite(Number(passed)) ? Number(passed) : 0,
                Number.isFinite(Number(total)) ? Number(total) : 0,
                runtimeMs != null && Number.isFinite(Number(runtimeMs)) ? Math.round(Number(runtimeMs)) : null,
            ],
        );
        res.status(201).json({ submission: result.rows?.[0] || null });
    } catch (err) {
        console.error('createSubmission error:', err.message);
        res.status(500).json({ error: 'Failed to save submission.' });
    }
};

/**
 * GET /api/submissions/:email/:problemId
 * Recent submissions for one problem (newest first, code excluded from the list).
 */
export const listSubmissions = async (req, res) => {
    try {
        const email = req.authEmail || req.params.email;
        const { problemId } = req.params;
        const result = await query(
            `SELECT id, problem_id, language, status, passed, total, runtime_ms, created_at
             FROM code_submissions
             WHERE user_email = $1 AND problem_id = $2
             ORDER BY id DESC
             LIMIT 25`,
            [email, problemId],
        );
        res.json({ submissions: result.rows || [] });
    } catch (err) {
        console.error('listSubmissions error:', err.message);
        res.status(500).json({ error: 'Failed to load submissions.' });
    }
};

/**
 * GET /api/submissions/:email
 * Per-problem best status across all problems — powers solved badges in the list.
 */
export const submissionSummary = async (req, res) => {
    try {
        const email = req.authEmail || req.params.email;
        const result = await query(
            `SELECT problem_id,
                    MAX(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS solved,
                    COUNT(*) AS attempts
             FROM code_submissions
             WHERE user_email = $1
             GROUP BY problem_id`,
            [email],
        );
        const byProblem = {};
        for (const row of result.rows || []) {
            byProblem[row.problem_id] = { solved: Number(row.solved) === 1, attempts: Number(row.attempts) };
        }
        res.json({ summary: byProblem });
    } catch (err) {
        console.error('submissionSummary error:', err.message);
        res.status(500).json({ error: 'Failed to load submission summary.' });
    }
};
