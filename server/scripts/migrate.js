import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import mysql from 'mysql2/promise';
import { loadEnv } from '../config/loadEnv.js';

loadEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'migrations');

const schemaFiles = {
    sqlite: '001_sqlite_schema.sql',
    postgres: '001_initial_schema.sql',
    mysql: '001_mysql_schema.sql',
};

const resolveProvider = () => {
    const raw = (
        process.env.AXIOM_DB_PROVIDER ||
        process.env.DB_PROVIDER ||
        process.env.DATABASE_PROVIDER ||
        'sqlite'
    ).toLowerCase();

    if (['postgres', 'postgresql', 'pg'].includes(raw)) return 'postgres';
    if (['mysql', 'mariadb'].includes(raw)) return 'mysql';
    return 'sqlite';
};

const loadSchema = (provider) => {
    const filename = schemaFiles[provider];
    if (!filename) {
        throw new Error(`Unsupported provider: ${provider}`);
    }
    return readFileSync(join(migrationsDir, filename), 'utf8');
};

const runSqliteMigration = async () => {
    const sql = loadSchema('sqlite');
    const { query } = await import('../config/db.js');
    await query(sql);
    console.log('✅ SQLite schema applied successfully');
};

const runPostgresMigration = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required for PostgreSQL migrations');
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const client = await pool.connect();
        try {
            const sql = loadSchema('postgres');
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('COMMIT');
            console.log('✅ PostgreSQL schema applied successfully');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    } finally {
        await pool.end();
    }
};

const runMysqlMigration = async () => {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required for MySQL migrations');
    }

    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL,
        multipleStatements: true,
    });

    try {
        const sql = loadSchema('mysql');
        await connection.query(sql);
        console.log('✅ MySQL schema applied successfully');
    } finally {
        await connection.end();
    }
};

const run = async () => {
    try {
        const provider = resolveProvider();
        console.log(`🚀 Running migrations for provider: ${provider}`);

        if (provider === 'postgres') {
            await runPostgresMigration();
            return;
        }

        if (provider === 'mysql') {
            await runMysqlMigration();
            return;
        }

        await runSqliteMigration();
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
};

run();
