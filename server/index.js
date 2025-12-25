import express from 'express';
import cors from 'cors';
import { query } from './db.js';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- Routes ---

// Get Cloudinary Signature
app.get('/api/sign-cloudinary', (req, res) => {
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({
        timestamp: timestamp,
        upload_preset: 'profile'
    }, process.env.CLOUDINARY_API_SECRET);

    res.json({ signature, timestamp });
});

// Get User Profile
app.get('/api/users/:email', async (req, res) => {
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
});

// Create/Update User Profile
app.post('/api/users/profile', async (req, res) => {
    try {
        const { email, name, role, location, bio, avatar, banner, experience, skills, socials } = req.body;

        // Check if user exists
        const checkUser = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (checkUser.rows.length > 0) {
            // Update
            const updateQuery = `
        UPDATE users 
        SET name = $2, role = $3, location = $4, bio = $5, avatar = $6, banner = $7, experience = $8, skills = $9, socials = $10 
        WHERE email = $1 
        RETURNING *
      `;
            const updatedUser = await query(updateQuery, [email, name, role, location, bio, avatar, banner, JSON.stringify(experience), JSON.stringify(skills), JSON.stringify(socials)]);
            return res.json(updatedUser.rows[0]);
        } else {
            // Insert
            const insertQuery = `
        INSERT INTO users (email, name, role, location, bio, avatar, banner, experience, skills, socials) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *
      `;
            const newUser = await query(insertQuery, [email, name, role, location, bio, avatar, banner, JSON.stringify(experience), JSON.stringify(skills), JSON.stringify(socials)]);
            return res.json(newUser.rows[0]);
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Initialize DB Table
app.get('/init-db', async (req, res) => {
    try {
        console.log('Initializing DB...');
        await query(`DROP TABLE IF EXISTS users CASCADE;`);
        console.log('Table dropped.');
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
                socials JSONB
            );
        `);
        res.send('Database initialized successfully');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
