import { query } from '../config/db.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();

cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const getCloudinarySignature = (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        upload_preset: 'profile'
    }, process.env.CLOUDINARY_API_SECRET);

    res.json({ signature, timestamp });
};

export const getUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { email, name, role, location, bio, avatar, banner, experience, skills, socials } = req.body;

        const queryText = `
            INSERT INTO users (
                email, name, role, location, bio, avatar, banner, 
                experience, skills, socials, resume_url, resume_name, updated_at
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
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
                updated_at = NOW()
            RETURNING *;
        `;

        const values = [
            email, name, role, location, bio, avatar, banner,
            JSON.stringify(experience), JSON.stringify(skills), JSON.stringify(socials),
            req.body.resume_url, req.body.resume_name
        ];

        const { rows } = await query(queryText, values);
        return res.json(rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const initDb = async (req, res) => {
    try {
        await query(`DROP TABLE IF EXISTS users CASCADE;`);
        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255),
                role VARCHAR(255),
                location VARCHAR(255),
                bio TEXT,
                avatar TEXT,
                banner TEXT,
                experience JSONB,
                skills JSONB,
                socials JSONB,
                resume_url TEXT,
                resume_name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        res.send('Database initialized successfully');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};
