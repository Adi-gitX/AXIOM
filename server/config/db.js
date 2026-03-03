import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './loadEnv.js';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS dsa_problem_journal (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            problem_id TEXT NOT NULL,
            notes TEXT,
            time_spent_minutes INTEGER DEFAULT 0,
            attempts INTEGER DEFAULT 0,
            last_attempted_at TEXT,
            review_interval_days INTEGER DEFAULT 1,
            review_due_date TEXT,
            last_reviewed_at TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_email, problem_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS github_connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT UNIQUE NOT NULL,
            github_user_id TEXT,
            username TEXT,
            avatar_url TEXT,
            access_token_enc TEXT,
            scope TEXT,
            stars_total INTEGER DEFAULT 0,
            connected_at TEXT DEFAULT CURRENT_TIMESTAMP,
            last_sync_at TEXT,
            sync_error TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS github_pull_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            pr_id INTEGER NOT NULL,
            repo_full_name TEXT,
            title TEXT,
            state TEXT,
            merged_at TEXT,
            created_at TEXT,
            html_url TEXT,
            UNIQUE(user_email, pr_id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS github_contribution_daily (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            activity_date TEXT NOT NULL,
            prs_opened INTEGER DEFAULT 0,
            prs_merged INTEGER DEFAULT 0,
            stars_gained INTEGER DEFAULT 0,
            UNIQUE(user_email, activity_date)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS good_first_issue_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            repo_full_name TEXT NOT NULL,
            issue_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            html_url TEXT NOT NULL,
            labels_json TEXT DEFAULT '[]',
            language TEXT,
            is_open INTEGER DEFAULT 1,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(repo_full_name, issue_number)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS gsoc_reminder_state (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            milestone_id TEXT NOT NULL,
            dismissed_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_email, milestone_id)
        )
    `);
};

const initDb = async () => {
    if (db) return db;

    SQL = await initSqlJs();

    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
        console.log('✅ SQLite database loaded:', dbPath);
    } else {
        db = new SQL.Database();
        console.log('✅ New SQLite database created:', dbPath);
    }

    try {
        ensureSchema();
    } catch (err) {
        // Avoid taking down every endpoint on local migration edge-cases.
        console.error('[db] Schema bootstrap failed:', err?.message || err);
    }

    return db;
};

// Save database to disk
const saveDb = () => {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(dbPath, buffer);
    }
};

// Save on process exit
process.on('exit', saveDb);
process.on('SIGINT', () => { saveDb(); process.exit(); });
process.on('SIGTERM', () => { saveDb(); process.exit(); });

// Query wrapper to match PostgreSQL-style interface
export const query = async (text, params = []) => {
    try {
        const database = await initDb();

        const { sqliteQuery, sqliteParams } = transformQuery(text, params);

        // Determine if this is a SELECT query
        const isSelect = sqliteQuery.trim().toUpperCase().startsWith('SELECT');
        const isReturning = sqliteQuery.toUpperCase().includes('RETURNING');

        if (isSelect || isReturning) {
            try {
                const stmt = database.prepare(sqliteQuery);
                if (sqliteParams.length > 0) {
                    stmt.bind(sqliteParams);
                }

                const rows = [];
                while (stmt.step()) {
                    rows.push(stmt.getAsObject());
                }
                stmt.free();
                saveDb();
                return { rows, rowCount: rows.length };
            } catch (err) {
                if (!isReturning) {
                    throw err;
                }

                // Fallback for environments without RETURNING support
                const cleanQuery = sqliteQuery.replace(/RETURNING\s+\*\s*;?$/i, '').trim();
                database.run(cleanQuery, sqliteParams);

                if (cleanQuery.toUpperCase().startsWith('INSERT')) {
                    const tableName = cleanQuery.match(/INTO\s+(\w+)/i)?.[1];
                    if (tableName) {
                        const lastId = database.exec('SELECT last_insert_rowid() as id')[0]?.values?.[0]?.[0];
                        if (lastId) {
                            const result = database.exec(`SELECT * FROM ${tableName} WHERE id = ${lastId}`);
                            if (result.length > 0 && result[0].values.length > 0) {
                                const columns = result[0].columns;
                                const values = result[0].values[0];
                                const row = {};
                                columns.forEach((col, i) => { row[col] = values[i]; });
                                saveDb();
                                return { rows: [row], rowCount: 1 };
                            }
                        }
                    }
                }

                saveDb();
                return { rows: [], rowCount: database.getRowsModified() };
            }
        } else {
            database.run(sqliteQuery, sqliteParams);
            saveDb();
            return {
                rows: [],
                rowCount: database.getRowsModified()
            };
        }
    } catch (err) {
        console.error('Database query error:', err.message);
        throw err;
    }
};

// Initialize on module load
initDb().catch(err => console.error('Failed to init database:', err.message));

export default { query };
