import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'migrations');

// Configure connection
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
    const client = await pool.connect();

    try {
        console.log('🚀 Starting database migrations...\n');

        // Ensure migrations table exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Get applied migrations
        const { rows: appliedMigrations } = await client.query(
            'SELECT name FROM migrations ORDER BY id'
        );
        const appliedSet = new Set(appliedMigrations.map(m => m.name));

        // Get migration files
        const files = readdirSync(migrationsDir)
            .filter(f => f.endsWith('.sql'))
            .sort();

        if (files.length === 0) {
            console.log('No migration files found.');
            return;
        }

        let migrationsRun = 0;

        for (const file of files) {
            const migrationName = file.replace('.sql', '');

            if (appliedSet.has(migrationName)) {
                console.log(`⏭️  Skipping ${migrationName} (already applied)`);
                continue;
            }

            console.log(`📦 Running ${migrationName}...`);

            const sql = readFileSync(join(migrationsDir, file), 'utf8');

            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query(
                    'INSERT INTO migrations (name) VALUES ($1) ON CONFLICT DO NOTHING',
                    [migrationName]
                );
                await client.query('COMMIT');
                console.log(`✅ ${migrationName} completed successfully`);
                migrationsRun++;
            } catch (err) {
                await client.query('ROLLBACK');
                console.error(`❌ Migration ${migrationName} failed:`, err.message);
                throw err;
            }
        }

        console.log(`\n🎉 Migrations complete! ${migrationsRun} migration(s) applied.`);

    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
