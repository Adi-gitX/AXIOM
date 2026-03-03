import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';
import { loadEnv } from '../config/loadEnv.js';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'migrations', '001_sqlite_schema.sql');

const parseJsonField = (value, fallback = []) => {
    if (value === null || value === undefined) return fallback;
    if (Array.isArray(value) || typeof value === 'object') return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const normalizeUser = (row) => {
    if (!row) return row;
    return {
        ...row,
        experience: parseJsonField(row.experience, []),
        skills: parseJsonField(row.skills, []),
        socials: parseJsonField(row.socials, []),
    };
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const isPlaceholderValue = (value) => {
    if (!value) return true;
    const normalized = String(value).trim().toLowerCase();
    if (!normalized) return true;
    return (
        normalized.startsWith('your_') ||
        normalized.includes('your_cloud_name') ||
        normalized.includes('your_api_key') ||
        normalized.includes('your_api_secret') ||
        normalized.includes('placeholder')
    );
};

export const getCloudinarySignature = (req, res) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'profile';

    if (
        isPlaceholderValue(cloudName) ||
        isPlaceholderValue(apiKey) ||
        isPlaceholderValue(apiSecret)
    ) {
        return res.status(500).json({
            error: 'Cloudinary credentials are not configured with real values',
            missing: {
                cloud_name: isPlaceholderValue(cloudName),
                api_key: isPlaceholderValue(apiKey),
                api_secret: isPlaceholderValue(apiSecret),
            },
        });
    }

    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        upload_preset: uploadPreset
    }, apiSecret);

    res.json({ signature, timestamp, upload_preset: uploadPreset, cloud_name: cloudName, api_key: apiKey });
};

export const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(normalizeUser(rows[0]));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { email, name, role, location, bio, avatar, banner, experience, skills, socials } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const queryText = `
            INSERT INTO users (
                email, name, role, location, bio, avatar, banner, 
                experience, skills, socials, resume_url, resume_name, updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
            ON CONFLICT (email) 
            DO UPDATE SET 
                name = EXCLUDED.name,
                role = EXCLUDED.role,
                location = EXCLUDED.location,
                bio = EXCLUDED.bio,
                avatar = EXCLUDED.avatar,
                banner = EXCLUDED.banner,
                experience = EXCLUDED.experience,
                skills = EXCLUDED.skills,
                socials = EXCLUDED.socials,
                resume_url = EXCLUDED.resume_url,
                resume_name = EXCLUDED.resume_name,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;

        const values = [
            email,
            name ?? null,
            role ?? null,
            location ?? null,
            bio ?? null,
            avatar ?? null,
            banner ?? null,
            JSON.stringify(experience || []),
            JSON.stringify(skills || []),
            JSON.stringify(socials || []),
            req.body.resume_url ?? null,
            req.body.resume_name ?? null
        ];

        const { rows } = await query(queryText, values);
        if (rows.length > 0) {
            return res.json(normalizeUser(rows[0]));
        }

        const latest = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (latest.rows.length > 0) {
            return res.json(normalizeUser(latest.rows[0]));
        }

        return res.status(500).json({ error: 'Profile update failed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
};

export const initDb = async (req, res) => {
    try {
        if (!fs.existsSync(schemaPath)) {
            return res.status(500).json({ error: 'SQLite schema file not found' });
        }

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await query(schemaSql);

        res.json({ message: 'Database initialized successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to initialize database', details: err.message });
    }
};

/**
 * Create or get a user - used for Firebase auth sync
 * Creates user in SQLite if they don't exist, returns existing if they do
 */
export const createOrGetUser = async (req, res) => {
    try {
        const { email, name, avatar } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // First try to get existing user
        const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            // User exists, return them
            return res.json({
                user: normalizeUser(existingUser.rows[0]),
                created: false
            });
        }

        // Create new user with minimal data
        const defaultAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
        const defaultName = name || email.split('@')[0];

        const newUser = await query(`
            INSERT INTO users (email, name, avatar, skills, experience, socials)
            VALUES ($1, $2, $3, '[]', '[]', '[]')
            RETURNING *
        `, [email, defaultName, defaultAvatar]);

        let createdUser = newUser.rows[0];
        if (!createdUser) {
            const refetch = await query('SELECT * FROM users WHERE email = $1', [email]);
            createdUser = refetch.rows[0];
        }

        res.status(201).json({
            user: normalizeUser(createdUser),
            created: true
        });
    } catch (err) {
        console.error('createOrGetUser error:', err.message);
        res.status(500).json({ error: 'Failed to create/get user' });
    }
};
