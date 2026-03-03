import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { loadEnv } from './config/loadEnv.js';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'axiom.db');

const run = async () => {
    try {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log(`🧹 Removed database file: ${dbPath}`);
        } else {
            console.log('ℹ️ No existing database file found');
        }

        execSync('node scripts/migrate.js', { stdio: 'inherit', cwd: __dirname });
        execSync('node scripts/seedJobs.js', { stdio: 'inherit', cwd: __dirname });
        execSync('node scripts/seedPosts.js', { stdio: 'inherit', cwd: __dirname });

        console.log('✅ Database reset complete');
    } catch (err) {
        console.error('❌ Database reset failed:', err.message);
        process.exit(1);
    }
};

run();
