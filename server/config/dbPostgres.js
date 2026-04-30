/**
 * Production Postgres driver — used when DATABASE_URL is set and reachable.
 *
 * Drop-in replacement for sql.js: same `query(text, params)` API, same return
 * shape `{ rows, rowCount }`. Schema lives at
 * `migrations/001_initial_schema.sql` and is applied on first connect.
 *
 * Resilience: if the configured Postgres host is unreachable (DNS failure,
 * SSL handshake failure, etc.), `initPostgres()` returns false and the caller
 * should fall back to sql.js. This keeps preview environments alive even when
 * the real prod DB is firewall-isolated from them.
 */
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_PATH = path.join(__dirname, '..', 'migrations', '001_initial_schema.sql');

let pool = null;
let schemaApplied = false;
let connectionVerified = false;

const buildPool = () => {
    const connectionString = (process.env.DATABASE_URL || '').trim();
    if (!connectionString) return null;
    const ssl = /sslmode=require|amazonaws|aivencloud|neon\.tech|railway|render\.com|supabase/i.test(
        connectionString,
    )
        ? { rejectUnauthorized: false }
        : false;
    return new pg.Pool({
        connectionString,
        ssl,
        max: 8,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 8_000, // fail fast in preview when host is unreachable
    });
};

const ensureSchema = async () => {
    if (schemaApplied || !pool) return;
    if (!fs.existsSync(SCHEMA_PATH)) {
        schemaApplied = true;
        return;
    }
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    if (!schemaSql.trim()) {
        schemaApplied = true;
        return;
    }
    await pool.query(schemaSql);
    schemaApplied = true;
    console.log('[db:postgres] schema applied');
};

export const isPostgresEnabled = () => Boolean((process.env.DATABASE_URL || '').trim());

/**
 * Resolve to true if Postgres is reachable AND schema is applied.
 * Returns false (and logs a warning) on any boot-time failure so the caller
 * can fall back to sql.js instead of crashing.
 */
export const initPostgres = async () => {
    if (!isPostgresEnabled()) return false;
    if (connectionVerified) return true;
    if (!pool) pool = buildPool();
    if (!pool) return false;
    try {
        // Cheap probe — verifies host resolves AND credentials are valid AND SSL handshake succeeds.
        await pool.query('SELECT 1');
        await ensureSchema();
        connectionVerified = true;
        return true;
    } catch (err) {
        console.warn(
            `[db:postgres] init failed (${err.code || 'unknown'}): ${err.message} — falling back to sql.js`,
        );
        try { await pool.end(); } catch { /* swallow */ }
        pool = null;
        return false;
    }
};

export const pgQuery = async (text, params = []) => {
    if (!pool) {
        const ok = await initPostgres();
        if (!ok) throw new Error('Postgres unavailable');
    }
    const result = await pool.query(text, params);
    return { rows: result.rows, rowCount: result.rowCount };
};

export const closePostgres = async () => {
    if (pool) {
        await pool.end();
        pool = null;
        schemaApplied = false;
        connectionVerified = false;
    }
};

export default { initPostgres, isPostgresEnabled, pgQuery, closePostgres };
