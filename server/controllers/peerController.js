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

/** POST /api/peer/rooms/:roomId/join — guest joins an open room. */
export const joinRoom = async (req, res) => {
    try {
        const email = req.authEmail || req.body?.email;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });
        const { name, avatar } = req.body || {};
        const { roomId } = req.params;
        const found = await query('SELECT * FROM peer_rooms WHERE id = $1', [roomId]);
        const room = found.rows?.[0];
        if (!room) return res.status(404).json({ error: 'Room not found.' });

        // Host (or already-joined guest) re-entering: just return it.
        if (room.host_email === email || room.guest_email === email) {
            return res.json({ room });
        }
        if (room.status !== 'open' || room.guest_email) {
            return res.status(409).json({ error: 'Room is no longer open.' });
        }
        await ensureStats(email, name, avatar);
        const updated = await query(
            `UPDATE peer_rooms SET guest_email = $1, guest_name = $2, status = 'active', started_at = CURRENT_TIMESTAMP
             WHERE id = $3 AND status = 'open' RETURNING *`,
            [email, name || email.split('@')[0], roomId],
        );
        res.json({ room: updated.rows?.[0] || room });
    } catch (err) {
        console.error('joinRoom error:', err.message);
        res.status(500).json({ error: 'Failed to join room.' });
    }
};

/** POST /api/peer/quick-match — join oldest open room at your level, else create one. */
export const quickMatch = async (req, res) => {
    try {
        const email = req.authEmail || req.body?.email;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });
        const { name, avatar, level = 'Intermediate', topic = null, problemId = null } = req.body || {};
        const safeLevel = LEVELS.has(level) ? level : 'Intermediate';
        const open = await query(
            "SELECT * FROM peer_rooms WHERE status = 'open' AND level = $1 AND host_email <> $2 ORDER BY created_at ASC LIMIT 1",
            [safeLevel, email],
        );
        const candidate = open.rows?.[0];
        if (candidate) {
            await ensureStats(email, name, avatar);
            const updated = await query(
                `UPDATE peer_rooms SET guest_email = $1, guest_name = $2, status = 'active', started_at = CURRENT_TIMESTAMP
                 WHERE id = $3 AND status = 'open' RETURNING *`,
                [email, name || email.split('@')[0], candidate.id],
            );
            return res.json({ room: updated.rows?.[0] || candidate, matched: true });
        }
        // none available — create one and wait
        req.body = { ...req.body, level: safeLevel, topic, problemId };
        return createRoom(req, res);
    } catch (err) {
        console.error('quickMatch error:', err.message);
        res.status(500).json({ error: 'Failed to match.' });
    }
};

/** POST /api/peer/rooms/:roomId/end */
export const endRoom = async (req, res) => {
    try {
        const email = req.authEmail || req.body?.email;
        const { roomId } = req.params;
        const found = await query('SELECT * FROM peer_rooms WHERE id = $1', [roomId]);
        const room = found.rows?.[0];
        if (!room) return res.status(404).json({ error: 'Room not found.' });
        if (email && room.host_email !== email && room.guest_email !== email) {
            return res.status(403).json({ error: 'Only a participant can end this room.' });
        }
        if (room.status === 'ended') return res.json({ room });
        const updated = await query(
            "UPDATE peer_rooms SET status = 'ended', ended_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
            [roomId],
        );
        // bump session counts
        for (const e of [room.host_email, room.guest_email].filter(Boolean)) {
            await query('UPDATE peer_stats SET sessions = sessions + 1, updated_at = CURRENT_TIMESTAMP WHERE user_email = $1', [e]).catch(() => {});
        }
        res.json({ room: updated.rows?.[0] || room });
    } catch (err) {
        console.error('endRoom error:', err.message);
        res.status(500).json({ error: 'Failed to end room.' });
    }
};

/** POST /api/peer/feedback — rate your peer; updates their rating. */
export const submitFeedback = async (req, res) => {
    try {
        const from = req.authEmail || req.body?.email;
        if (!from) return res.status(401).json({ error: 'Unauthorized' });
        const { roomId, problemSolving, communication, codeQuality, notes } = req.body || {};
        if (!roomId) return res.status(400).json({ error: 'roomId required.' });

        // Integrity: only a participant may rate, and only their actual peer — derive
        // toEmail from the room rather than trusting the client (prevents rating abuse).
        const found = await query('SELECT host_email, guest_email FROM peer_rooms WHERE id = $1', [roomId]);
        const room = found.rows?.[0];
        if (!room) return res.status(404).json({ error: 'Room not found.' });
        if (room.host_email !== from && room.guest_email !== from) {
            return res.status(403).json({ error: 'Only a participant can leave feedback.' });
        }
        const toEmail = room.host_email === from ? room.guest_email : room.host_email;
        if (!toEmail) return res.status(400).json({ error: 'No peer to rate in this room.' });

        const ps = clampScore(problemSolving);
        const co = clampScore(communication);
        const cq = clampScore(codeQuality);
        await query(
            `INSERT INTO peer_feedback (room_id, from_email, to_email, problem_solving, communication, code_quality, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [roomId, from, toEmail, ps, co, cq, String(notes || '').slice(0, 2000)],
        );
        // Rating update: average (1-5) maps to ±20 around the neutral 3.
        const avg = (ps + co + cq) / 3;
        const delta = Math.round((avg - 3) * 10);
        await ensureStats(toEmail);
        await query('UPDATE peer_stats SET rating = MAX(0, rating + $1), updated_at = CURRENT_TIMESTAMP WHERE user_email = $2', [delta, toEmail]).catch(() => {});
        res.status(201).json({ ok: true, delta });
    } catch (err) {
        console.error('submitFeedback error:', err.message);
        res.status(500).json({ error: 'Failed to submit feedback.' });
    }
};

/** GET /api/peer/leaderboard */
export const getLeaderboard = async (req, res) => {
    try {
        const result = await query(
            'SELECT user_email, name, avatar, rating, level, sessions FROM peer_stats ORDER BY rating DESC, sessions DESC LIMIT 25',
        );
        res.json({ leaderboard: result.rows || [] });
    } catch (err) {
        console.error('getLeaderboard error:', err.message);
        res.status(500).json({ error: 'Failed to load leaderboard.' });
    }
};

/** GET /api/peer/stats/:email — my stats (creates a default row if missing). */
export const getMyStats = async (req, res) => {
    try {
        const email = req.authEmail || req.params.email;
        if (!email) return res.status(401).json({ error: 'Unauthorized' });
        await ensureStats(email);
        const result = await query('SELECT user_email, name, avatar, rating, level, sessions FROM peer_stats WHERE user_email = $1', [email]);
        res.json({ stats: result.rows?.[0] || { user_email: email, rating: 1200, level: 'Intermediate', sessions: 0 } });
    } catch (err) {
        console.error('getMyStats error:', err.message);
        res.status(500).json({ error: 'Failed to load stats.' });
    }
};
