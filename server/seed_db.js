import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from './config/loadEnv.js';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'axiom.db');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const seed = async () => {
    console.log('\n🌱 Starting SQLite database seed...\n');

    const SQL = await initSqlJs();

    // Load or create database
    let db;
    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
        console.log('📂 Loaded existing database');
    } else {
        db = new SQL.Database();
        console.log('📂 Created new database');
    }

    // Run schema
    console.log('📋 Running schema migration...');
    const schemaPath = path.join(__dirname, 'migrations', '001_sqlite_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.run(schema);
    console.log('✅ Schema created\n');

    // Insert jobs
    console.log('💼 Seeding jobs...');
    const jobs = [
        ['Senior Frontend Developer', 'TechCorp', 'San Francisco, CA', 'Full-time', '$150k - $200k', 'Looking for experienced React developer.', '["React", "TypeScript"]', 1],
        ['Backend Engineer', 'StartupXYZ', 'New York, NY', 'Full-time', '$130k - $170k', 'Build scalable microservices.', '["Node.js", "AWS"]', 1],
        ['Full Stack Developer', 'InnovateLab', 'Austin, TX', 'Full-time', '$120k - $160k', 'Work across the entire stack.', '["React", "Node.js"]', 0],
        ['DevOps Engineer', 'CloudScale', 'Remote', 'Full-time', '$140k - $180k', 'CI/CD and infrastructure.', '["Kubernetes", "Docker"]', 1],
        ['Junior React Developer', 'WebAgency', 'Los Angeles, CA', 'Full-time', '$70k - $90k', 'Great for junior devs.', '["React", "JavaScript"]', 0],
        ['Software Intern', 'BigTech Inc', 'Seattle, WA', 'Internship', '$40/hr', 'Summer internship.', '["Python", "Algorithms"]', 0],
        ['React Native Developer', 'MobileFirst', 'Remote', 'Contract', '$100/hr', '6-month mobile contract.', '["React Native", "TypeScript"]', 1],
        ['Python Data Engineer', 'DataDriven', 'Boston, MA', 'Full-time', '$130k - $165k', 'Data pipelines.', '["Python", "Spark"]', 1]
    ];

    for (const job of jobs) {
        try {
            db.run(`INSERT INTO jobs (title, company, location, job_type, salary, description, requirements, is_remote)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, job);
            console.log(`  ✓ ${job[0]}`);
        } catch (e) {
            console.log(`  → ${job[0]} (skipped)`);
        }
    }
    console.log('');

    // Insert channels
    console.log('💬 Seeding chat channels...');
    const channels = [
        ['general', 'General', 'General discussion', 1],
        ['react', 'React', 'React discussions', 1],
        ['jobs', 'Jobs', 'Job opportunities', 1],
        ['help', 'Help', 'Get help with code', 1]
    ];

    for (const channel of channels) {
        try {
            db.run(`INSERT INTO chat_channels (channel_id, name, description, is_default)
                    VALUES (?, ?, ?, ?)`, channel);
            console.log(`  ✓ #${channel[1]}`);
        } catch (e) {
            console.log(`  → #${channel[1]} (skipped)`);
        }
    }
    console.log('');

    // Insert sample posts
    console.log('📝 Seeding posts...');
    const posts = [
        ['AXIOM', 'A', '#6366f1', 'Welcome to AXIOM!', 'This is the first post.', 'System', null, '[]', '1m read'],
        ['Dev.to', 'D', '#0A0A0A', 'Understanding React Hooks', 'A deep dive into useState.', 'Dan Dev', null, '["react", "hooks"]', '5m read'],
        ['GitHub', 'G', '#24292e', 'Next.js 15 Released', 'Major performance improvements.', 'Vercel Team', null, '["nextjs", "react"]', '3m read']
    ];

    for (const post of posts) {
        try {
            db.run(`INSERT INTO posts (source_name, source_icon, source_color, title, description, author_name, author_avatar, tags, read_time)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, post);
            console.log(`  ✓ ${post[3]}`);
        } catch (e) {
            console.log(`  → ${post[3]} (skipped)`);
        }
    }
    console.log('');

    // Save database
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);

    console.log('🎉 Database seeding complete!');
    console.log(`📁 Database location: ${dbPath}\n`);

    db.close();
};

seed().catch(console.error);
