import crypto from 'crypto';
import { query } from '../config/db.js';

const LEVELS = new Set(['Beginner', 'Intermediate', 'Advanced']);
const clampScore = (n) => Math.max(0, Math.min(5, Number(n) || 0));

const newRoomId = () => `room_${crypto.randomUUID().slice(0, 8)}`;

async function ensureStats(email, name, avatar) {
    await query(
        `INSERT INTO peer_stats (user_email, name, avatar)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_email) DO UPDATE SET name = COALESCE(EXCLUDED.name, peer_stats.name), avatar = COALESCE(EXCLUDED.avatar, peer_stats.avatar)`,
        [email, name || null, avatar || null],
    ).catch(async (err) => {
        // sql.js has limited ON CONFLICT DO UPDATE support in some builds — fall back.
        if (/ON CONFLICT|syntax/i.test(String(err?.message))) {
            const existing = await query('SELECT user_email FROM peer_stats WHERE user_email = $1', [email]);
            if (!existing.rows?.length) {
                await query('INSERT INTO peer_stats (user_email, name, avatar) VALUES ($1, $2, $3)', [email, name || null, avatar || null]);
            }
        } else {
            throw err;
        }
    });
}

/** POST /api/peer/rooms — host creates a room. */
export const createRoom = async (req, res) => {
    try {
        const email = req.authEmail || req.body?.email;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });
        const { name, avatar, level = 'Intermediate', topic = null, problemId = null, language = 'javascript' } = req.body || {};
        const safeLevel = LEVELS.has(level) ? level : 'Intermediate';
        const safeLang = ['python', 'javascript', 'typescript'].includes(language) ? language : 'javascript';
        const id = newRoomId();
        await ensureStats(email, name, avatar);
        const result = await query(
            `INSERT INTO peer_rooms (id, host_email, host_name, level, topic, problem_id, language, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'open') RETURNING *`,
            [id, email, name || email.split('@')[0], safeLevel, topic, problemId, safeLang],
        );
        res.status(201).json({ room: result.rows?.[0] || { id } });
    } catch (err) {
        console.error('createRoom error:', err.message);
        res.status(500).json({ error: 'Failed to create room.' });
    }
};

/** GET /api/peer/rooms?level= — list open rooms. */
export const listOpenRooms = async (req, res) => {
    try {
        const { level } = req.query || {};
        const params = [];
        let sql = "SELECT * FROM peer_rooms WHERE status = 'open'";
        if (level && LEVELS.has(level)) { params.push(level); sql += ` AND level = $${params.length}`; }
        sql += ' ORDER BY created_at ASC LIMIT 50';
        const result = await query(sql, params);
        res.json({ rooms: result.rows || [] });
    } catch (err) {
        console.error('listOpenRooms error:', err.message);
        res.status(500).json({ error: 'Failed to list rooms.' });
    }
};

/** GET /api/peer/rooms/:roomId */
export const getRoom = async (req, res) => {
    try {
        const result = await query('SELECT * FROM peer_rooms WHERE id = $1', [req.params.roomId]);
        const room = result.rows?.[0];
        if (!room) return res.status(404).json({ error: 'Room not found.' });
        res.json({ room });
    } catch (err) {
        console.error('getRoom error:', err.message);
        res.status(500).json({ error: 'Failed to load room.' });
    }
};


// TODO: Complete implementation in subsequent commits (Stage 1/3)
