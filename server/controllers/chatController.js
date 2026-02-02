import { query } from '../config/db.js';

/**
 * Get all chat channels
 */
export const getChannels = async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                channel_id as id,
                name,
                description
            FROM chat_channels
            ORDER BY is_default DESC, name ASC
        `);

        res.json(result.rows);
    } catch (err) {
        console.error('getChannels error:', err.message);
        res.status(500).json({ error: 'Failed to get channels' });
    }
};

/**
 * Get messages for a channel
 */
export const getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { limit = 50, before } = req.query;

        let sql = `
            SELECT 
                id,
                user_email as email,
                user_name as user,
                user_avatar as avatar,
                content,
                created_at as time
            FROM chat_messages
            WHERE channel_id = $1 AND is_deleted = false
        `;
        const params = [channelId];

        if (before) {
            sql += ` AND id < $2`;
            params.push(parseInt(before));
        }

        sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));

        const result = await query(sql, params);

        // Reverse to get chronological order
        res.json(result.rows.reverse());
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

        const result = await query(`
            INSERT INTO chat_messages (channel_id, user_email, user_name, user_avatar, content)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, user_email as email, user_name as user, user_avatar as avatar, content, created_at as time
        `, [channelId, email, userName || email.split('@')[0], userAvatar, content]);

        // Update daily activity
        await query(`
            INSERT INTO user_activity (user_email, activity_date, messages_sent)
            VALUES ($1, $2, 1)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                messages_sent = user_activity.messages_sent + 1
        `, [email, today]);

        res.json(result.rows[0]);
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
        const { id } = req.params;
        const { email } = req.body;

        // Only allow deleting own messages
        const result = await query(`
            UPDATE chat_messages 
            SET is_deleted = true 
            WHERE id = $1 AND user_email = $2
            RETURNING id
        `, [parseInt(id), email]);

        if (result.rows.length === 0) {
            return res.status(403).json({ error: 'Cannot delete this message' });
        }

        res.json({ deleted: true, id: parseInt(id) });
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
        const { since } = req.query;

        if (!since) {
            return res.status(400).json({ error: 'since parameter required' });
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
            WHERE channel_id = $1 AND id > $2 AND is_deleted = false
            ORDER BY created_at ASC
        `, [channelId, parseInt(since)]);

        res.json(result.rows);
    } catch (err) {
        console.error('getNewMessages error:', err.message);
        res.status(500).json({ error: 'Failed to get new messages' });
    }
};
