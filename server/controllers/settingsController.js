/**
 * Settings Controller
 * Manages user settings and preferences
 */

import { query } from '../config/db.js';

const defaults = {
    theme: 'system',
    email_notifications: true,
    push_notifications: true,
    weekly_digest: true,
    product_updates: true,
};

const toBool = (value) => value === true || value === 1 || value === '1';
const toIntFlag = (value) => (value ? 1 : 0);
const toNullableIntFlag = (value) => {
    if (value === undefined || value === null) return null;
    return toIntFlag(Boolean(value));
};

const normalizeSettings = (row) => {
    if (!row) return { ...defaults };
    return {
        ...row,
        theme: row.theme || 'system',
        email_notifications: toBool(row.email_notifications),
        push_notifications: toBool(row.push_notifications),
        weekly_digest: toBool(row.weekly_digest),
        product_updates: toBool(row.product_updates),
    };
};

const fetchByEmail = async (email) => {
    const result = await query('SELECT * FROM user_settings WHERE email = $1', [email]);
    return normalizeSettings(result.rows[0]);
};

// Get user settings
export const getSettings = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await query(
            'SELECT * FROM user_settings WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.json({ ...defaults });
        }

        res.json(normalizeSettings(result.rows[0]));
    } catch (err) {
        console.error('Error getting settings:', err);
        res.status(500).json({ error: 'Failed to get settings' });
    }
};

// Update all settings
export const updateSettings = async (req, res) => {
    try {
        const { email, theme, email_notifications, push_notifications, weekly_digest, product_updates } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const result = await query(`
            INSERT INTO user_settings (email, theme, email_notifications, push_notifications, weekly_digest, product_updates)
            VALUES ($1, COALESCE($2, 'system'), COALESCE($3, 1), COALESCE($4, 1), COALESCE($5, 1), COALESCE($6, 1))
            ON CONFLICT (email) DO UPDATE SET
                theme = COALESCE($2, user_settings.theme),
                email_notifications = COALESCE($3, user_settings.email_notifications),
                push_notifications = COALESCE($4, user_settings.push_notifications),
                weekly_digest = COALESCE($5, user_settings.weekly_digest),
                product_updates = COALESCE($6, user_settings.product_updates)
            RETURNING *
        `, [
            email,
            theme ?? null,
            toNullableIntFlag(email_notifications),
            toNullableIntFlag(push_notifications),
            toNullableIntFlag(weekly_digest),
            toNullableIntFlag(product_updates),
        ]);

        if (result.rows.length > 0) {
            return res.json(normalizeSettings(result.rows[0]));
        }

        return res.json(await fetchByEmail(email));
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

// Update theme only
export const updateTheme = async (req, res) => {
    try {
        const { email, theme } = req.body;

        if (!email || !theme) {
            return res.status(400).json({ error: 'Email and theme are required' });
        }

        const result = await query(`
            INSERT INTO user_settings (email, theme)
            VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE SET
                theme = $2
            RETURNING *
        `, [email, theme]);

        if (result.rows.length > 0) {
            return res.json(normalizeSettings(result.rows[0]));
        }

        return res.json(await fetchByEmail(email));
    } catch (err) {
        console.error('Error updating theme:', err);
        res.status(500).json({ error: 'Failed to update theme' });
    }
};

// Update notification settings only
export const updateNotifications = async (req, res) => {
    try {
        const { email, notifications = {} } = req.body;
        const { email_notifications, push_notifications, weekly_digest, product_updates } = notifications;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const result = await query(`
            INSERT INTO user_settings (email, email_notifications, push_notifications, weekly_digest, product_updates)
            VALUES ($1, COALESCE($2, 1), COALESCE($3, 1), COALESCE($4, 1), COALESCE($5, 1))
            ON CONFLICT (email) DO UPDATE SET
                email_notifications = COALESCE($2, user_settings.email_notifications),
                push_notifications = COALESCE($3, user_settings.push_notifications),
                weekly_digest = COALESCE($4, user_settings.weekly_digest),
                product_updates = COALESCE($5, user_settings.product_updates)
            RETURNING *
        `, [
            email,
            toNullableIntFlag(email_notifications),
            toNullableIntFlag(push_notifications),
            toNullableIntFlag(weekly_digest),
            toNullableIntFlag(product_updates),
        ]);

        if (result.rows.length > 0) {
            return res.json(normalizeSettings(result.rows[0]));
        }

        return res.json(await fetchByEmail(email));
    } catch (err) {
        console.error('Error updating notifications:', err);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
};
