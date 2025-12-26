import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Force SSL rejection off globally for this process to handle self-signed certs
// This is a common workaround for Aiven/Heroku dev databases
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

pool.on('connect', () => {
    console.log('Connected to Database successfully');
});

export const query = (text, params) => pool.query(text, params);
export default { query };
