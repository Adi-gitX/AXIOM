import { query } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

// Force SSL bypass
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const reset = async () => {
    try {
        console.log('Dropping table...');
        await query('DROP TABLE IF EXISTS users CASCADE');
        console.log('Table dropped.');

        console.log('Creating table...');
        await query(`
            CREATE TABLE users (
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
        console.log('Table created successfully with ROLE column.');
        process.exit(0);
    } catch (err) {
        console.error('Reset Failed:', err);
        process.exit(1);
    }
};

reset();
