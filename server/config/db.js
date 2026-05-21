import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './loadEnv.js';
import { isPostgresEnabled, initPostgres, pgQuery } from './dbPostgres.js';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Driver selection — prefers Postgres when DATABASE_URL is set AND reachable.
// Falls back to sql.js if Postgres init fails (e.g. preview cluster firewall).
let usingPostgres = false;
const driverReady = (async () => {
    if (isPostgresEnabled()) {
        usingPostgres = await initPostgres();
        if (usingPostgres) {
            console.log('[db] driver: postgres');
        } else {
            console.log('[db] driver: sql.js (Postgres unreachable from this network)');
        }
    } else {
        console.log('[db] driver: sql.js (set DATABASE_URL to enable Postgres)');
    }
})();

// Database path
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'axiom.db');
const schemaPath = path.join(__dirname, '..', 'migrations', '001_sqlite_schema.sql');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize sql.js
let db = null;
let SQL = null;

const transformQuery = (text, params) => {
    if (!/\$\d+/.test(text)) {
        return { sqliteQuery: text, sqliteParams: params };
    }

    const sqliteParams = [];
    const sqliteQuery = text.replace(/\$(\d+)/g, (_match, rawIndex) => {
        const index = Number.parseInt(rawIndex, 10) - 1;
        sqliteParams.push(params[index]);
        return '?';
    });

    return { sqliteQuery, sqliteParams };
};

const ensureSchema = () => {
    if (!db || !fs.existsSync(schemaPath)) return;
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    if (!schemaSql.trim()) return;
    db.run(schemaSql);
    ensureRuntimeSchema();
    saveDb();
};

const tableExists = (tableName) => {
    const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?");
    stmt.bind([tableName]);
    const exists = stmt.step();
    stmt.free();
    return exists;
};

const getTableColumns = (tableName) => {
    const columns = new Set();
    const stmt = db.prepare(`PRAGMA table_info(${tableName})`);
    while (stmt.step()) {
        const row = stmt.getAsObject();
        columns.add(String(row.name));
    }
    stmt.free();
    return columns;
};

const stripUnsupportedAlterDefault = (columnSql) => (
    String(columnSql || '').replace(/\s+DEFAULT\s+CURRENT_(TIMESTAMP|TIME|DATE)\b/ig, '')
);

const ensureColumns = (tableName, columnsDefinition) => {
    if (!tableExists(tableName)) return;
    const existing = getTableColumns(tableName);
    for (const [columnName, columnSql] of Object.entries(columnsDefinition)) {
        if (existing.has(columnName)) continue;
        const alterSql = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnSql}`;
        try {
            db.run(alterSql);
            continue;
        } catch (err) {
            const message = String(err?.message || '');
            const fallbackSqlDefinition = stripUnsupportedAlterDefault(columnSql).trim();
            const hasExpressionDefault = /DEFAULT\s+CURRENT_(TIMESTAMP|TIME|DATE)\b/i.test(String(columnSql || ''));
            const canRetryWithoutExpressionDefault = hasExpressionDefault
                && fallbackSqlDefinition
                && fallbackSqlDefinition !== String(columnSql || '').trim();

            if (!canRetryWithoutExpressionDefault) {
                console.error(`[db] Failed to add column ${tableName}.${columnName}: ${message}`);
                continue;
            }

            try {
                db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${fallbackSqlDefinition}`);
                if (/DEFAULT\s+CURRENT_TIMESTAMP\b/i.test(String(columnSql || ''))) {
                    db.run(`UPDATE ${tableName} SET ${columnName} = CURRENT_TIMESTAMP WHERE ${columnName} IS NULL`);
                }
                console.warn(
                    `[db] Added ${tableName}.${columnName} without expression default due SQLite ALTER limitations.`
                );
            } catch (fallbackErr) {
                console.error(
                    `[db] Failed fallback add column ${tableName}.${columnName}: ${fallbackErr?.message || fallbackErr}`
                );
            }
        }
    }
};

const ensureRuntimeSchema = () => {
    // Backfill columns for pre-existing local databases created with older schemas.
    ensureColumns('users', {
        username: 'TEXT',
        github_username: 'TEXT',
        banner: 'TEXT',
        resume_url: 'TEXT',
        resume_name: 'TEXT',
        is_pro: 'INTEGER DEFAULT 0',
        portfolio_visibility: 'INTEGER DEFAULT 1',
        updated_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    try {
        db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users(username)');
    } catch (err) {
        console.warn(`[db] Could not enforce unique username index: ${err?.message || err}`);
        // Keep app functional even when legacy data has collisions.
        db.run('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    }

    ensureColumns('posts', {
        source_icon: 'TEXT',
        source_color: 'TEXT',
        author_avatar: 'TEXT',
        published_at: 'TEXT',
        external_url: 'TEXT',
        github_stats: 'TEXT',
        tags: "TEXT DEFAULT '[]'",
        read_time: 'TEXT',
        upvotes: 'INTEGER DEFAULT 0',
        downvotes: 'INTEGER DEFAULT 0',
        comments_count: 'INTEGER DEFAULT 0',
        is_active: 'INTEGER DEFAULT 1',
        created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    ensureColumns('education_progress', {
        progress: 'INTEGER DEFAULT 0',
        completed: 'INTEGER DEFAULT 0',
        last_watched: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    ensureColumns('jobs', {
        description: 'TEXT',
        requirements: "TEXT DEFAULT '[]'",
        apply_url: 'TEXT',
        company_logo: 'TEXT',
        is_active: 'INTEGER DEFAULT 1',
        posted_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
        expires_at: 'TEXT',
        created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    ensureColumns('user_settings', {
        theme: "TEXT DEFAULT 'system'",
        email_notifications: 'INTEGER DEFAULT 1',
        push_notifications: 'INTEGER DEFAULT 1',
        weekly_digest: 'INTEGER DEFAULT 1',
        product_updates: 'INTEGER DEFAULT 1',
        created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    ensureColumns('user_progress', {
        total_problems_solved: 'INTEGER DEFAULT 0',
        current_streak: 'INTEGER DEFAULT 0',
        longest_streak: 'INTEGER DEFAULT 0',
        total_study_minutes: 'INTEGER DEFAULT 0',
        last_activity_date: 'TEXT',
        created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    ensureColumns('user_activity', {
        problems_solved: 'INTEGER DEFAULT 0',
        study_minutes: 'INTEGER DEFAULT 0',
        videos_watched: 'INTEGER DEFAULT 0',
        messages_sent: 'INTEGER DEFAULT 0',
        created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    ensureColumns('solved_problems', {
        topic_id: 'INTEGER',
        solved_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
        notes: 'TEXT',
    });

    ensureColumns('dsa_problem_journal', {
        notes: 'TEXT',
        time_spent_minutes: 'INTEGER DEFAULT 0',
        attempts: 'INTEGER DEFAULT 0',
        last_attempted_at: 'TEXT',
        review_interval_days: 'INTEGER DEFAULT 1',
        review_due_date: 'TEXT',
        last_reviewed_at: 'TEXT',
        created_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
        updated_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    ensureColumns('github_connections', {
        github_user_id: 'TEXT',
        username: 'TEXT',
        avatar_url: 'TEXT',
        access_token_enc: 'TEXT',
        scope: 'TEXT',
        stars_total: 'INTEGER DEFAULT 0',
        connected_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
        last_sync_at: 'TEXT',
        sync_error: 'TEXT',
    });

    ensureColumns('github_pull_requests', {
        repo_full_name: 'TEXT',
        title: 'TEXT',
        state: 'TEXT',
        merged_at: 'TEXT',
        created_at: 'TEXT',
        html_url: 'TEXT',
    });

    ensureColumns('github_contribution_daily', {
        prs_opened: 'INTEGER DEFAULT 0',
        prs_merged: 'INTEGER DEFAULT 0',
        stars_gained: 'INTEGER DEFAULT 0',
    });

    ensureColumns('good_first_issue_cache', {
        labels_json: "TEXT DEFAULT '[]'",
        language: 'TEXT',
        is_open: 'INTEGER DEFAULT 1',
        updated_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

    ensureColumns('chat_channels', {
        is_private: 'INTEGER DEFAULT 0',
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS chat_room_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channel_id TEXT NOT NULL,
            user_email TEXT NOT NULL,
            role TEXT DEFAULT 'member',
            invited_at TEXT DEFAULT CURRENT_TIMESTAMP,
            accepted_at TEXT,
            UNIQUE(channel_id, user_email)
        )
    `);

    ensureColumns('chat_room_members', {
        role: "TEXT DEFAULT 'member'",
        invited_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
        accepted_at: 'TEXT',


// TODO: Complete implementation in subsequent commits (Stage 1/2)
