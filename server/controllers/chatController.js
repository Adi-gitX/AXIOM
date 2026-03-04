import { query } from '../config/db.js';

const DEFAULT_CHANNELS = [
    { channel_id: 'general', name: 'General', description: 'General discussion' },
    { channel_id: 'react', name: 'React', description: 'React, hooks, components' },
    { channel_id: 'jobs', name: 'Jobs', description: 'Opportunities & careers' },
    { channel_id: 'help', name: 'Help', description: 'Get help with code' },
    { channel_id: 'gsoc', name: 'GSOC', description: 'Google Summer of Code prep and updates' },
];

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value) => value === true || value === 1 || value === '1';
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const toDateString = (date = new Date()) => date.toISOString().split('T')[0];
const isAcceptedMembership = (value) => value !== null && value !== undefined && String(value).trim() !== '';

const resolveRequesterEmail = (req) => normalizeEmail(
    req.authEmail
    || req.body?.email
    || req.query?.email
    || req.params?.email
);

let ensureChannelsPromise = null;
const ensureDefaultChannels = async () => {
    if (ensureChannelsPromise) {
        await ensureChannelsPromise;
        return;
    }

    ensureChannelsPromise = (async () => {
        for (const channel of DEFAULT_CHANNELS) {
            await query(`
                INSERT INTO chat_channels (channel_id, name, description, is_default)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (channel_id) DO NOTHING
            `, [channel.channel_id, channel.name, channel.description, 1]);
        }
    })();

    try {
        await ensureChannelsPromise;
    } finally {
        ensureChannelsPromise = null;
    }
};

const normalizeChannel = (row, requesterEmail = '') => ({
    id: row.id || row.channel_id,
    name: row.name,
    description: row.description || '',
    is_default: toBool(row.is_default),
    is_private: toBool(row.is_private),
    created_by: row.created_by || null,
    created_at: row.created_at || null,
    is_member: toBool(row.is_member),
    member_role: row.member_role || null,
    can_manage_members: Boolean(
        requesterEmail
        && row.created_by
        && normalizeEmail(row.created_by) === normalizeEmail(requesterEmail)
    ),
});

const normalizeMessage = (row) => ({
    id: toInt(row.id),
    email: row.email || row.user_email,
    user: row.user || row.user_name || 'Unknown',
    avatar: row.avatar || row.user_avatar || null,
    content: row.content || '',
    time: row.time || row.created_at || null,
});

const normalizeMember = (row) => ({
    email: normalizeEmail(row.user_email),
    role: row.role || 'member',
    invited_at: row.invited_at || null,
    accepted_at: row.accepted_at || null,
    is_pending: !isAcceptedMembership(row.accepted_at),
});

const getChannelById = async (channelId) => {
    const result = await query(`
        SELECT channel_id, name, description, is_default, is_private, created_by, created_at
        FROM chat_channels
        WHERE channel_id = $1
        LIMIT 1
    `, [channelId]);

    return result.rows[0] || null;
};

const hasPrivateChannelAccess = async (channelId, email) => {
    if (!channelId || !email) return false;
    const membershipResult = await query(`
        SELECT accepted_at
        FROM chat_room_members
        WHERE channel_id = $1 AND user_email = $2
        LIMIT 1
    `, [channelId, email]);
    return isAcceptedMembership(membershipResult.rows[0]?.accepted_at);
};

const requireChannelAccess = async ({ channelId, email }) => {
    const channel = await getChannelById(channelId);
    if (!channel) {
        return { channel: null, allowed: false, status: 404, error: 'Channel not found' };
    }

    if (!toBool(channel.is_private)) {
        return { channel, allowed: true };
    }

    if (!email) {
        return { channel, allowed: false, status: 403, error: 'Private room access denied' };
    }

    if (normalizeEmail(channel.created_by) === normalizeEmail(email)) {
        return { channel, allowed: true };
    }

    const hasAccess = await hasPrivateChannelAccess(channel.channel_id, normalizeEmail(email));
    if (hasAccess) {
        return { channel, allowed: true };
    }

    return { channel, allowed: false, status: 403, error: 'Private room access denied' };
};

/**
 * Get all chat channels
 */
export const getChannels = async (req, res) => {
    try {
        await ensureDefaultChannels();
        const email = resolveRequesterEmail(req);

        if (!email) {
            const result = await query(`
                SELECT
                    channel_id as id,
                    name,
                    description,
                    is_default,
                    is_private,
                    created_by,
                    created_at
                FROM chat_channels
                WHERE is_private = 0
                ORDER BY is_default DESC, name ASC
            `);
            return res.json({ channels: result.rows.map((row) => normalizeChannel(row, '')) });
        }

        const result = await query(`
            SELECT
                c.channel_id as id,
                c.name,
                c.description,
                c.is_default,
                c.is_private,
                c.created_by,
                c.created_at,
                CASE
                    WHEN c.created_by = $1 THEN 1
                    WHEN m.accepted_at IS NOT NULL THEN 1
                    ELSE 0
                END as is_member,
                CASE
                    WHEN c.created_by = $1 THEN 'owner'
                    ELSE COALESCE(m.role, NULL)
                END as member_role
            FROM chat_channels c
            LEFT JOIN chat_room_members m
                ON m.channel_id = c.channel_id
               AND m.user_email = $1
            WHERE c.is_private = 0
               OR c.created_by = $1
               OR m.accepted_at IS NOT NULL
            ORDER BY c.is_default DESC, c.name ASC
        `, [email]);

        return res.json({ channels: result.rows.map((row) => normalizeChannel(row, email)) });
    } catch (err) {
        console.error('getChannels error:', err.message);
        res.status(500).json({ error: 'Failed to get channels' });
    }
};

/**
 * Get online users (active in recent chat window)
 */
export const getOnlineUsers = async (_req, res) => {
    try {
        const result = await query(`
            SELECT
                user_email,
                user_name,
                user_avatar,
                MAX(created_at) as last_seen
            FROM chat_messages
            WHERE is_deleted = 0
              AND created_at >= datetime('now', '-30 minutes')
            GROUP BY user_email, user_name, user_avatar
            ORDER BY last_seen DESC
            LIMIT 50
        `);

        const users = result.rows.map((row) => ({
            email: row.user_email,
            name: row.user_name || row.user_email?.split('@')[0] || 'User',
            avatar: row.user_avatar || null,
            last_seen: row.last_seen || null,
        }));

        res.json({ users });
    } catch (err) {
        console.error('getOnlineUsers error:', err.message);
        res.status(500).json({ error: 'Failed to get online users' });
    }
};

/**
 * Create a new channel/group
 */
export const createChannel = async (req, res) => {
    try {
        const { name, description, isPrivate } = req.body;
        const email = resolveRequesterEmail(req);
        const wantsPrivate = toBool(isPrivate);

        if (!name || !email) {
            return res.status(400).json({ error: 'Channel name and email are required' });
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

        if (wantsPrivate) {
            const userResult = await query(
                'SELECT is_pro FROM users WHERE email = $1 LIMIT 1',
                [email]
            );
            const isPro = toBool(userResult.rows[0]?.is_pro);
            if (!isPro) {
                return res.status(403).json({ error: 'Private rooms are available on Pro plan only' });
            }
        }

        const result = await query(`
            INSERT INTO chat_channels (channel_id, name, description, is_default, is_private, created_by)
            VALUES ($1, $2, $3, 0, $4, $5)
            RETURNING channel_id as id, name, description, is_default, is_private, created_by, created_at
        `, [channelId, name, description || '', wantsPrivate ? 1 : 0, email || null]);

        if (wantsPrivate) {
            await query(`
                INSERT INTO chat_room_members (
                    channel_id,
                    user_email,
                    role,
                    invited_at,
                    accepted_at
                )
                VALUES ($1, $2, 'owner', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT (channel_id, user_email) DO UPDATE SET
                    role = 'owner',
                    accepted_at = CURRENT_TIMESTAMP
            `, [channelId, email]);
        }

        let channel = result.rows[0];
        if (!channel) {
            const refetch = await query(`
                SELECT channel_id as id, name, description, is_default, is_private, created_by, created_at
                FROM chat_channels
                WHERE channel_id = $1
            `, [channelId]);
            channel = refetch.rows[0];
        }

        res.status(201).json({ channel: normalizeChannel(channel, email) });
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
        const email = resolveRequesterEmail(req);
        const limit = Math.min(200, Math.max(1, toInt(req.query.limit, 50)));
        const before = req.query.before ? toInt(req.query.before, 0) : null;

        await ensureDefaultChannels();
        const access = await requireChannelAccess({ channelId, email });
        if (!access.allowed) {
            return res.status(access.status).json({ error: access.error });
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
        const { channelId, content, userName, userAvatar } = req.body;
        const email = resolveRequesterEmail(req);
        const today = toDateString();

        if (!email || !channelId || !content) {
            return res.status(400).json({ error: 'email, channelId and content are required' });
        }

        await ensureDefaultChannels();
        const access = await requireChannelAccess({ channelId, email });
        if (!access.allowed) {
            return res.status(access.status).json({ error: access.error });
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
        const email = resolveRequesterEmail(req);

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
        const email = resolveRequesterEmail(req);
        if (req.query.since === undefined || req.query.since === null) {
            return res.status(400).json({ error: 'since parameter required' });
        }

        const since = toInt(req.query.since, 0);
        if (since < 0) {
            return res.status(400).json({ error: 'since must be >= 0' });
        }

        await ensureDefaultChannels();
        const access = await requireChannelAccess({ channelId, email });
        if (!access.allowed) {
            return res.status(access.status).json({ error: access.error });
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

export const getChannelMembers = async (req, res) => {
    try {
        const { channelId } = req.params;
        const requesterEmail = resolveRequesterEmail(req);

        await ensureDefaultChannels();
        const access = await requireChannelAccess({ channelId, email: requesterEmail });
        if (!access.allowed) {
            return res.status(access.status).json({ error: access.error });
        }

        if (!toBool(access.channel?.is_private)) {
            return res.status(400).json({ error: 'Member list is available only for private rooms' });
        }

        const membersResult = await query(`
            SELECT user_email, role, invited_at, accepted_at
            FROM chat_room_members
            WHERE channel_id = $1
            ORDER BY
                CASE role WHEN 'owner' THEN 0 ELSE 1 END,
                invited_at ASC
        `, [channelId]);

        return res.json({
            members: membersResult.rows.map(normalizeMember),
        });
    } catch (err) {
        console.error('getChannelMembers error:', err.message);
        return res.status(500).json({ error: 'Failed to get channel members' });
    }
};

export const inviteChannelMember = async (req, res) => {
    try {
        const { channelId } = req.params;
        const requesterEmail = resolveRequesterEmail(req);
        const memberEmail = normalizeEmail(req.body?.memberEmail);

        if (!requesterEmail || !memberEmail) {
            return res.status(400).json({ error: 'requester and memberEmail are required' });
        }

        await ensureDefaultChannels();
        const channel = await getChannelById(channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }
        if (!toBool(channel.is_private)) {
            return res.status(400).json({ error: 'Invites are supported only for private rooms' });
        }
        if (normalizeEmail(channel.created_by) !== requesterEmail) {
            return res.status(403).json({ error: 'Only private room owner can invite members' });
        }
        if (memberEmail === requesterEmail) {
            return res.status(400).json({ error: 'Owner is already a member' });
        }

        await query(`
            INSERT INTO chat_room_members (
                channel_id,
                user_email,
                role,
                invited_at,
                accepted_at
            )
            VALUES ($1, $2, 'member', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (channel_id, user_email) DO UPDATE SET
                role = CASE
                    WHEN chat_room_members.role = 'owner' THEN 'owner'
                    ELSE 'member'
                END,
                invited_at = CURRENT_TIMESTAMP,
                accepted_at = CURRENT_TIMESTAMP
        `, [channelId, memberEmail]);

        const memberResult = await query(`
            SELECT user_email, role, invited_at, accepted_at
            FROM chat_room_members
            WHERE channel_id = $1 AND user_email = $2
            LIMIT 1
        `, [channelId, memberEmail]);

        return res.json({
            channelId,
            member: normalizeMember(memberResult.rows[0] || {
                user_email: memberEmail,
                role: 'member',
                invited_at: null,
                accepted_at: null,
            }),
        });
    } catch (err) {
        console.error('inviteChannelMember error:', err.message);
        return res.status(500).json({ error: 'Failed to invite member' });
    }
};

export const removeChannelMember = async (req, res) => {
    try {
        const { channelId } = req.params;
        const requesterEmail = resolveRequesterEmail(req);
        const memberEmail = normalizeEmail(req.body?.memberEmail);

        if (!requesterEmail || !memberEmail) {
            return res.status(400).json({ error: 'requester and memberEmail are required' });
        }

        await ensureDefaultChannels();
        const channel = await getChannelById(channelId);
        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }
        if (!toBool(channel.is_private)) {
            return res.status(400).json({ error: 'Member management is supported only for private rooms' });
        }
        if (normalizeEmail(channel.created_by) !== requesterEmail) {
            return res.status(403).json({ error: 'Only private room owner can remove members' });
        }
        if (memberEmail === normalizeEmail(channel.created_by)) {
            return res.status(400).json({ error: 'Owner cannot be removed from a private room' });
        }

        const deletion = await query(`
            DELETE FROM chat_room_members
            WHERE channel_id = $1 AND user_email = $2
            RETURNING user_email
        `, [channelId, memberEmail]);

        if (deletion.rows.length === 0) {
            return res.status(404).json({ error: 'Member not found in this room' });
        }

        return res.json({
            channelId,
            removed: memberEmail,
        });
    } catch (err) {
        console.error('removeChannelMember error:', err.message);
        return res.status(500).json({ error: 'Failed to remove member' });
    }
};
