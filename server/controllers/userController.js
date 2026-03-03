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

const normalizeUsername = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 40);

const normalizeUser = (row) => {
    if (!row) return row;
    return {
        ...row,
        experience: parseJsonField(row.experience, []),
        skills: parseJsonField(row.skills, []),
        socials: parseJsonField(row.socials, []),
        portfolio_visibility: Number.parseInt(row.portfolio_visibility, 10) !== 0,
    };
};

const isPlaceholderValue = (value) => {
    if (!value) return true;
    const normalized = String(value).trim().toLowerCase();
    if (!normalized) return true;
    return (
        normalized.startsWith('your_')
        || normalized.includes('your_cloud_name')
        || normalized.includes('your_api_key')
        || normalized.includes('your_api_secret')
        || normalized.includes('placeholder')
    );
};

const buildUsernameFromEmail = (email) => {
    const localPart = String(email || '').split('@')[0] || 'dev';
    return normalizeUsername(localPart) || 'dev';
};

const ensureUniqueUsername = async (baseCandidate, exceptEmail = null) => {
    const base = normalizeUsername(baseCandidate) || 'dev';

    for (let i = 0; i < 5000; i += 1) {
        const candidate = i === 0 ? base : `${base}${i}`;
        const result = await query(
            'SELECT email FROM users WHERE username = $1 LIMIT 1',
            [candidate]
        );

        if (result.rows.length === 0) {
            return candidate;
        }

        const owner = result.rows[0]?.email;
        if (owner && exceptEmail && owner === exceptEmail) {
            return candidate;
        }
    }

    return `${base}${Date.now()}`;
};

const computeAtsScore = (user) => {
    const skills = parseJsonField(user.skills, []);
    const experience = parseJsonField(user.experience, []);
    const socials = parseJsonField(user.socials, []);

    let score = 0;
    const suggestions = [];

    if (String(user.name || '').trim().length >= 2) {
        score += 10;
    } else {
        suggestions.push('Add your full name.');
    }

    if (String(user.role || '').trim().length >= 4) {
        score += 10;
    } else {
        suggestions.push('Set a specific target role headline.');
    }

    if (String(user.location || '').trim()) {
        score += 5;
    } else {
        suggestions.push('Add your location for recruiter relevance.');
    }

    const bioLength = String(user.bio || '').trim().length;
    if (bioLength >= 120) {
        score += 20;
    } else if (bioLength >= 60) {
        score += 12;
        suggestions.push('Expand your summary with measurable impact.');
    } else {
        suggestions.push('Write a stronger summary (60+ words).');
    }

    if (skills.length >= 8) {
        score += 20;
    } else if (skills.length >= 4) {
        score += 12;
        suggestions.push('Add more role-relevant technical skills.');
    } else {
        suggestions.push('List at least 6-8 technical skills.');
    }

    if (experience.length >= 2) {
        score += 20;
    } else if (experience.length === 1) {
        score += 12;
        suggestions.push('Add another project/work experience entry.');
    } else {
        suggestions.push('Add experience entries with outcomes.');
    }

    if (String(user.resume_url || '').trim()) {
        score += 10;
    } else {
        suggestions.push('Upload your resume PDF.');
    }

    const hasGithub = socials.some((item) => String(item?.platform || '').toLowerCase().includes('github'))
        || String(user.github_username || '').trim();
    if (hasGithub) {
        score += 5;
    } else {
        suggestions.push('Link your GitHub profile.');
    }

    return {
        score: Math.min(100, score),
        suggestions: suggestions.slice(0, 5),
    };
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getCloudinarySignature = (_req, res) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'profile';

    if (
        isPlaceholderValue(cloudName)
        || isPlaceholderValue(apiKey)
        || isPlaceholderValue(apiSecret)
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

    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
        timestamp,
        upload_preset: uploadPreset,
    }, apiSecret);

    return res.json({
        signature,
        timestamp,
        upload_preset: uploadPreset,
        cloud_name: cloudName,
        api_key: apiKey,
    });
};

export const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json(normalizeUser(rows[0]));
    } catch (err) {
        console.error('getUserProfile error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const username = normalizeUsername(req.params.username);
        if (!username) {
            return res.status(400).json({ error: 'username is required' });
        }

        const userResult = await query(`
            SELECT *
            FROM users
            WHERE username = $1 AND portfolio_visibility = 1
            LIMIT 1
        `, [username]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Public profile not found' });
        }

        const user = normalizeUser(userResult.rows[0]);

        const [prsResult, ossStatsResult] = await Promise.all([
            query(`
                SELECT repo_full_name, title, state, merged_at, created_at, html_url
                FROM github_pull_requests
                WHERE user_email = $1
                ORDER BY COALESCE(merged_at, created_at) DESC
                LIMIT 8
            `, [user.email]),
            query(`
                SELECT
                    COUNT(*) as prs_opened,
                    SUM(CASE WHEN merged_at IS NOT NULL AND merged_at != '' THEN 1 ELSE 0 END) as prs_merged
                FROM github_pull_requests
                WHERE user_email = $1
            `, [user.email]),
        ]);

        return res.json({
            profile: {
                username: user.username,
                name: user.name,
                role: user.role,
                location: user.location,
                bio: user.bio,
                avatar: user.avatar,
                banner: user.banner,
                skills: user.skills,
                experience: user.experience,
                socials: user.socials,
                github_username: user.github_username || null,
            },
            ossShowcase: {
                prsOpened: Number.parseInt(ossStatsResult.rows[0]?.prs_opened, 10) || 0,
                prsMerged: Number.parseInt(ossStatsResult.rows[0]?.prs_merged, 10) || 0,
                recentPrs: prsResult.rows,
            },
        });
    } catch (err) {
        console.error('getPublicProfile error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch public profile' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const {
            email,
            name,
            role,
            location,
            bio,
            avatar,
            banner,
            experience,
            skills,
            socials,
            username,
            github_username,
            portfolio_visibility,
        } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const existingResult = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
        const existingRow = existingResult.rows[0] || {};

        let nextUsername = normalizeUsername(username);
        if (!nextUsername) {
            nextUsername = normalizeUsername(existingRow.username)
                || await ensureUniqueUsername(buildUsernameFromEmail(email), email);
        } else {
            nextUsername = await ensureUniqueUsername(nextUsername, email);
        }

        const mergedExperience = experience !== undefined
            ? parseJsonField(experience, [])
            : parseJsonField(existingRow.experience, []);
        const mergedSkills = skills !== undefined
            ? parseJsonField(skills, [])
            : parseJsonField(existingRow.skills, []);
        const mergedSocials = socials !== undefined
            ? parseJsonField(socials, [])
            : parseJsonField(existingRow.socials, []);
        const mergedPortfolioVisibility = portfolio_visibility !== undefined
            ? (portfolio_visibility === false || portfolio_visibility === 0 || portfolio_visibility === '0' ? 0 : 1)
            : (Number.parseInt(existingRow.portfolio_visibility, 10) === 0 ? 0 : 1);

        const queryText = `
            INSERT INTO users (
                email, name, username, role, location, bio, avatar, banner,
                github_username, experience, skills, socials,
                resume_url, resume_name, portfolio_visibility, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP)
            ON CONFLICT (email)
            DO UPDATE SET
                name = EXCLUDED.name,
                username = EXCLUDED.username,
                role = EXCLUDED.role,
                location = EXCLUDED.location,
                bio = EXCLUDED.bio,
                avatar = EXCLUDED.avatar,
                banner = EXCLUDED.banner,
                github_username = EXCLUDED.github_username,
                experience = EXCLUDED.experience,
                skills = EXCLUDED.skills,
                socials = EXCLUDED.socials,
                resume_url = EXCLUDED.resume_url,
                resume_name = EXCLUDED.resume_name,
                portfolio_visibility = EXCLUDED.portfolio_visibility,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *;
        `;

        const values = [
            email,
            name !== undefined ? name : (existingRow.name ?? null),
            nextUsername,
            role !== undefined ? role : (existingRow.role ?? null),
            location !== undefined ? location : (existingRow.location ?? null),
            bio !== undefined ? bio : (existingRow.bio ?? null),
            avatar !== undefined ? avatar : (existingRow.avatar ?? null),
            banner !== undefined ? banner : (existingRow.banner ?? null),
            github_username !== undefined ? github_username : (existingRow.github_username ?? null),
            JSON.stringify(mergedExperience),
            JSON.stringify(mergedSkills),
            JSON.stringify(mergedSocials),
            req.body.resume_url !== undefined ? req.body.resume_url : (existingRow.resume_url ?? null),
            req.body.resume_name !== undefined ? req.body.resume_name : (existingRow.resume_name ?? null),
            mergedPortfolioVisibility,
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
        console.error('updateUserProfile error:', err.message);
        return res.status(500).json({ error: 'Failed to update user profile' });
    }
};

export const updateUsername = async (req, res) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).json({ error: 'email and username are required' });
        }

        const normalized = normalizeUsername(username);
        if (!normalized || normalized.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 valid characters' });
        }

        const existing = await query(
            'SELECT email FROM users WHERE username = $1 LIMIT 1',
            [normalized]
        );

        if (existing.rows.length > 0 && existing.rows[0].email !== email) {
            return res.status(409).json({ error: 'Username already taken' });
        }

        await query(`
            INSERT INTO users (email, username)
            VALUES ($1, $2)
            ON CONFLICT (email) DO UPDATE SET
                username = EXCLUDED.username,
                updated_at = CURRENT_TIMESTAMP
        `, [email, normalized]);

        const latest = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
        return res.json(normalizeUser(latest.rows[0]));
    } catch (err) {
        console.error('updateUsername error:', err.message);
        return res.status(500).json({ error: 'Failed to update username' });
    }
};

export const getAtsScore = async (req, res) => {
    try {
        const { email } = req.params;
        if (!email) {
            return res.status(400).json({ error: 'email is required' });
        }

        const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const ats = computeAtsScore(user);

        return res.json({
            score: ats.score,
            suggestions: ats.suggestions,
        });
    } catch (err) {
        console.error('getAtsScore error:', err.message);
        return res.status(500).json({ error: 'Failed to compute ATS score' });
    }
};

export const initDb = async (_req, res) => {
    try {
        if (!fs.existsSync(schemaPath)) {
            return res.status(500).json({ error: 'SQLite schema file not found' });
        }

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await query(schemaSql);

        return res.json({ message: 'Database initialized successfully' });
    } catch (err) {
        console.error('initDb error:', err.message);
        return res.status(500).json({ error: 'Failed to initialize database', details: err.message });
    }
};

/**
 * Create or get a user - used for Firebase auth sync
 */
export const createOrGetUser = async (req, res) => {
    try {
        const { email, name, avatar } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            const user = normalizeUser(existingUser.rows[0]);
            if (!user.username) {
                const username = await ensureUniqueUsername(buildUsernameFromEmail(email), email);
                await query('UPDATE users SET username = $2 WHERE email = $1', [email, username]);
                const updated = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
                return res.json({ user: normalizeUser(updated.rows[0]), created: false });
            }
            return res.json({ user, created: false });
        }

        const defaultAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
        const defaultName = name || email.split('@')[0];
        const username = await ensureUniqueUsername(buildUsernameFromEmail(email));

        const newUser = await query(`
            INSERT INTO users (email, name, username, avatar, skills, experience, socials)
            VALUES ($1, $2, $3, $4, '[]', '[]', '[]')
            RETURNING *
        `, [email, defaultName, username, defaultAvatar]);

        let createdUser = newUser.rows[0];
        if (!createdUser) {
            const refetch = await query('SELECT * FROM users WHERE email = $1', [email]);
            createdUser = refetch.rows[0];
        }

        return res.status(201).json({
            user: normalizeUser(createdUser),
            created: true,
        });
    } catch (err) {
        console.error('createOrGetUser error:', err.message);
        return res.status(500).json({ error: 'Failed to create/get user' });
    }
};

export default {
    getCloudinarySignature,
    getUserProfile,
    getPublicProfile,
    updateUserProfile,
    updateUsername,
    getAtsScore,
    initDb,
    createOrGetUser,
};
