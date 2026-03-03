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

const ensureColumns = (tableName, columnsDefinition) => {
    if (!tableExists(tableName)) return;
    const existing = getTableColumns(tableName);
    for (const [columnName, columnSql] of Object.entries(columnsDefinition)) {
        if (existing.has(columnName)) continue;
        db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnSql}`);
    }
};

const ensureRuntimeSchema = () => {
    // Backfill columns for pre-existing local databases created with older schemas.
    ensureColumns('users', {
        banner: 'TEXT',
        resume_url: 'TEXT',
        resume_name: 'TEXT',
        is_pro: 'INTEGER DEFAULT 0',
        updated_at: 'TEXT DEFAULT CURRENT_TIMESTAMP',
    });

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

    ensureSchema();

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
