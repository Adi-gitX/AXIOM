import { query } from '../config/db.js';

const DEFAULT_CHANNELS = [
    { channel_id: 'general', name: 'General', description: 'General discussion' },
    { channel_id: 'react', name: 'React', description: 'React, hooks, components' },
    { channel_id: 'jobs', name: 'Jobs', description: 'Opportunities & careers' },
    { channel_id: 'help', name: 'Help', description: 'Get help with code' },
];

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value) => value === true || value === 1 || value === '1';

let ensureChannelsPromise = null;
const ensureDefaultChannels = async () => {
    if (ensureChannelsPromise) {
        await ensureChannelsPromise;
        return;
    }

    ensureChannelsPromise = (async () => {
        for (const [index, channel] of DEFAULT_CHANNELS.entries()) {
            await query(`
                INSERT INTO chat_channels (channel_id, name, description, is_default)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (channel_id) DO NOTHING
            `, [channel.channel_id, channel.name, channel.description, index < 4 ? 1 : 0]);
        }
    })();

    try {
        await ensureChannelsPromise;
    } finally {
        ensureChannelsPromise = null;
    }
};

const normalizeChannel = (row) => ({
    id: row.id || row.channel_id,
    name: row.name,
    description: row.description || '',
    is_default: toBool(row.is_default),
    created_by: row.created_by || null,
    created_at: row.created_at || null,
});

const normalizeMessage = (row) => ({
    id: toInt(row.id),
    email: row.email || row.user_email,
    user: row.user || row.user_name || 'Unknown',
    avatar: row.avatar || row.user_avatar || null,
    content: row.content || '',
    time: row.time || row.created_at || null,
});

/**
 * Get all chat channels
 */
export const getChannels = async (_req, res) => {
    try {
        await ensureDefaultChannels();

        const result = await query(`
            SELECT
                channel_id as id,
                name,
                description,
                is_default,
                created_by,
                created_at
            FROM chat_channels
            ORDER BY is_default DESC, name ASC
        `);

        res.json({ channels: result.rows.map(normalizeChannel) });
    } catch (err) {
        console.error('getChannels error:', err.message);
        res.status(500).json({ error: 'Failed to get channels' });
    }
};

/**
 * Create a new channel/group
 */
export const createChannel = async (req, res) => {
    try {
        const { name, description, email } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Channel name is required' });
        }

        await ensureDefaultChannels();

        const baseId = name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        const channelId = baseId || `channel-${Date.now()}`;

        const existing = await query(
            'SELECT channel_id FROM chat_channels WHERE channel_id = $1',
            [channelId]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'A channel with this name already exists' });
        }

        const result = await query(`
            INSERT INTO chat_channels (channel_id, name, description, is_default, created_by)
            VALUES ($1, $2, $3, 0, $4)
            RETURNING channel_id as id, name, description, is_default, created_by, created_at
        `, [channelId, name, description || '', email || null]);

        let channel = result.rows[0];
        if (!channel) {
            const refetch = await query(`
                SELECT channel_id as id, name, description, is_default, created_by, created_at
                FROM chat_channels
                WHERE channel_id = $1
            `, [channelId]);
            channel = refetch.rows[0];
        }

        res.status(201).json({ channel: normalizeChannel(channel) });
    } catch (err) {
        console.error('createChannel error:', err.message);
        res.status(500).json({ error: 'Failed to create channel' });
    }
};

/**
 * Get messages for a channel
 */
export const getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const limit = Math.min(200, Math.max(1, toInt(req.query.limit, 50)));
        const before = req.query.before ? toInt(req.query.before, 0) : null;

        await ensureDefaultChannels();
        const channelExists = await query(
            'SELECT channel_id FROM chat_channels WHERE channel_id = $1',
            [channelId]
        );
        if (channelExists.rows.length === 0) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        let sql = `
            SELECT
                id,
                user_email as email,
                user_name as user,
                user_avatar as avatar,
                content,
                created_at as time
            FROM chat_messages
            WHERE channel_id = $1 AND is_deleted = 0
        `;
        const params = [channelId];

        if (before && before > 0) {
            sql += ` AND id < $2`;
            params.push(before);
        }

        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await query(sql, params);
        res.json({ messages: result.rows.reverse().map(normalizeMessage) });
    } catch (err) {
        console.error('getMessages error:', err.message);
        res.status(500).json({ error: 'Failed to get messages' });
    }
};

/**
 * Send a message to a channel
 */
export const sendMessage = async (req, res) => {
    try {
        const { email, channelId, content, userName, userAvatar } = req.body;
        const today = new Date().toISOString().split('T')[0];

        if (!email || !channelId || !content) {
            return res.status(400).json({ error: 'email, channelId and content are required' });
        }

        await ensureDefaultChannels();

        const channelExists = await query(
            'SELECT channel_id FROM chat_channels WHERE channel_id = $1',
            [channelId]
        );
        if (channelExists.rows.length === 0) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const result = await query(`
            INSERT INTO chat_messages (channel_id, user_email, user_name, user_avatar, content)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, user_email as email, user_name as user, user_avatar as avatar, content, created_at as time
        `, [channelId, email, userName || email.split('@')[0], userAvatar || null, content]);

        let message = result.rows[0];
        if (!message) {
            const refetch = await query(`
                SELECT id, user_email as email, user_name as user, user_avatar as avatar, content, created_at as time
                FROM chat_messages
                WHERE channel_id = $1
                ORDER BY id DESC
                LIMIT 1
            `, [channelId]);
            message = refetch.rows[0];
        }

        await query(`
            INSERT INTO user_activity (user_email, activity_date, messages_sent)
            VALUES ($1, $2, 1)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                messages_sent = user_activity.messages_sent + 1
        `, [email, today]).catch(() => { });

        res.json(normalizeMessage(message));
    } catch (err) {
        console.error('sendMessage error:', err.message);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

/**
 * Delete a message (soft delete)
 */
export const deleteMessage = async (req, res) => {
    try {
        const id = toInt(req.params.id);
        const email = req.body.email || req.query.email;

        if (!id || !email) {
            return res.status(400).json({ error: 'message id and email are required' });
        }

        const result = await query(`
            UPDATE chat_messages
            SET is_deleted = 1
            WHERE id = $1 AND user_email = $2
            RETURNING id
        `, [id, email]);

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'Cannot delete this message' });
        }

        res.json({ deleted: true, id });
    } catch (err) {
        console.error('deleteMessage error:', err.message);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

/**
 * Get new messages since a given ID (for polling)
 */
export const getNewMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        if (req.query.since === undefined || req.query.since === null) {
            return res.status(400).json({ error: 'since parameter required' });
        }

        const since = toInt(req.query.since, 0);
        if (since < 0) {
            return res.status(400).json({ error: 'since must be >= 0' });
        }

        await ensureDefaultChannels();
        const channelExists = await query(
            'SELECT channel_id FROM chat_channels WHERE channel_id = $1',
            [channelId]
        );
        if (channelExists.rows.length === 0) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        const result = await query(`
            SELECT
                id,
                user_email as email,
                user_name as user,
                user_avatar as avatar,
                content,
                created_at as time
            FROM chat_messages
            WHERE channel_id = $1 AND id > $2 AND is_deleted = 0
            ORDER BY created_at ASC
        `, [channelId, since]);

        res.json({ messages: result.rows.map(normalizeMessage) });
    } catch (err) {
        console.error('getNewMessages error:', err.message);
        res.status(500).json({ error: 'Failed to get new messages' });
    }
};
