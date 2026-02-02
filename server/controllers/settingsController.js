/**
 * Settings Controller
 * Manages user settings and preferences
 */

import pool from '../config/db.js';

// Get user settings
export const getSettings = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await pool.query(
            'SELECT * FROM user_settings WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            // Return default settings if none exist
            return res.json({
                theme: 'system',
                email_notifications: true,
                push_notifications: true,
                weekly_digest: true,
                product_updates: true
            });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error getting settings:', err);
        res.status(500).json({ error: 'Failed to get settings' });
    }
};

// Update user settings
export const updateSettings = async (req, res) => {
    try {
        const { email, theme, email_notifications, push_notifications, weekly_digest, product_updates } = req.body;

        const result = await pool.query(`
            INSERT INTO user_settings (email, theme, email_notifications, push_notifications, weekly_digest, product_updates, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            ON CONFLICT (email) DO UPDATE SET
                theme = COALESCE($2, user_settings.theme),
                email_notifications = COALESCE($3, user_settings.email_notifications),
                push_notifications = COALESCE($4, user_settings.push_notifications),
                weekly_digest = COALESCE($5, user_settings.weekly_digest),
                product_updates = COALESCE($6, user_settings.product_updates),
                updated_at = NOW()
            RETURNING *
        `, [email, theme, email_notifications, push_notifications, weekly_digest, product_updates]);

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

// Update theme only
export const updateTheme = async (req, res) => {
    try {
        const { email, theme } = req.body;

        const result = await pool.query(`
            INSERT INTO user_settings (email, theme, updated_at)
            VALUES ($1, $2, NOW())
            ON CONFLICT (email) DO UPDATE SET
                theme = $2,
                updated_at = NOW()
            RETURNING *
        `, [email, theme]);

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating theme:', err);
        res.status(500).json({ error: 'Failed to update theme' });
    }
};

// Update notification settings
export const updateNotifications = async (req, res) => {
    try {
        const { email, notifications } = req.body;
        const { email_notifications, push_notifications, weekly_digest, product_updates } = notifications;

        const result = await pool.query(`
            INSERT INTO user_settings (email, email_notifications, push_notifications, weekly_digest, product_updates, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (email) DO UPDATE SET
                email_notifications = COALESCE($2, user_settings.email_notifications),
                push_notifications = COALESCE($3, user_settings.push_notifications),
                weekly_digest = COALESCE($4, user_settings.weekly_digest),
                product_updates = COALESCE($5, user_settings.product_updates),
                updated_at = NOW()
            RETURNING *
        `, [email, email_notifications, push_notifications, weekly_digest, product_updates]);

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating notifications:', err);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
};
