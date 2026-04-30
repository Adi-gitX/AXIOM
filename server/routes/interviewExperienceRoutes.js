import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

const ensureSchema = async () => {
    await query(`
        CREATE TABLE IF NOT EXISTS interview_experiences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company TEXT NOT NULL,
            role TEXT NOT NULL,
            rounds INTEGER DEFAULT 0,
            problems INTEGER DEFAULT 0,
            result TEXT DEFAULT 'Selected',
            difficulty TEXT DEFAULT 'Medium',
            location TEXT DEFAULT 'Remote',
            experience_years TEXT DEFAULT '0-1',
            author_name TEXT NOT NULL,
            author_role TEXT,
            quote TEXT NOT NULL,
            upvotes INTEGER DEFAULT 0,
            posted_at TEXT DEFAULT CURRENT_TIMESTAMP,
            is_active INTEGER DEFAULT 1
        )
    `);
};

/**
 * GET /api/interviews
 * Optional query: ?company=Google&difficulty=Medium&result=Selected&sort=upvotes|recent
 */
router.get('/', async (req, res, next) => {
    try {
        await ensureSchema();
        const { company, difficulty, result, sort = 'upvotes' } = req.query;
        const conditions = ['is_active = 1'];
        const params = [];
        if (company) { params.push(company); conditions.push(`company = $${params.length}`); }
        if (difficulty) { params.push(difficulty); conditions.push(`difficulty = $${params.length}`); }
        if (result) { params.push(result); conditions.push(`result = $${params.length}`); }
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const orderBy = sort === 'recent' ? 'posted_at DESC' : 'upvotes DESC, posted_at DESC';
        const sql = `SELECT * FROM interview_experiences ${where} ORDER BY ${orderBy} LIMIT 200`;
        const result_ = await query(sql, params);
        res.json({ experiences: result_.rows, total: result_.rows.length });
    } catch (err) { next(err); }
});

/**
 * GET /api/interviews/companies
 * Aggregate experiences grouped by company.
 */
router.get('/companies', async (_req, res, next) => {
    try {
        await ensureSchema();
        const result = await query(`
            SELECT company, COUNT(*) as count
            FROM interview_experiences
            WHERE is_active = 1
            GROUP BY company
            ORDER BY count DESC
        `);
        res.json({ companies: result.rows });
    } catch (err) { next(err); }
});

/**
 * POST /api/interviews
 * Submit a new interview experience (open submission, no auth in dev).
 */
router.post('/', async (req, res, next) => {
    try {
        await ensureSchema();
        const {
            company, role, rounds = 0, problems = 0, result = 'Selected',
            difficulty = 'Medium', location = 'Remote', experience_years = '0-1',
            author_name, author_role = '', quote,
        } = req.body || {};
        if (!company || !role || !author_name || !quote) {
            return res.status(400).json({ error: 'Missing required fields: company, role, author_name, quote' });
        }
        const insert = await query(
            `INSERT INTO interview_experiences
             (company, role, rounds, problems, result, difficulty, location, experience_years, author_name, author_role, quote, posted_at, is_active)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,1) RETURNING *`,
            [company, role, rounds, problems, result, difficulty, location, experience_years, author_name, author_role, quote, new Date().toISOString()]
        );
        res.status(201).json({ experience: insert.rows[0] });
    } catch (err) { next(err); }
});

/**
 * POST /api/interviews/:id/upvote
 */
router.post('/:id/upvote', async (req, res, next) => {
    try {
        await ensureSchema();
        const id = Number.parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
        await query('UPDATE interview_experiences SET upvotes = upvotes + 1 WHERE id = $1', [id]);
        const r = await query('SELECT upvotes FROM interview_experiences WHERE id = $1', [id]);
        res.json({ id, upvotes: r.rows[0]?.upvotes ?? 0 });
    } catch (err) { next(err); }
});

export default router;
