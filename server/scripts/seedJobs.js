import pg from 'pg';
import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Seed jobs data
const JOBS = [
    { title: 'Frontend Developer', company: 'Google', location: 'Remote', job_type: 'Full-time', salary: '$150K - $200K', is_remote: true },
    { title: 'Backend Engineer', company: 'Meta', location: 'Menlo Park, CA', job_type: 'Full-time', salary: '$170K - $220K', is_remote: false },
    { title: 'Full Stack Developer', company: 'Stripe', location: 'San Francisco', job_type: 'Full-time', salary: '$160K - $210K', is_remote: false },
    { title: 'React Developer', company: 'Airbnb', location: 'Remote', job_type: 'Contract', salary: '$80/hr', is_remote: true },
    { title: 'Software Engineer', company: 'Netflix', location: 'Los Gatos, CA', job_type: 'Full-time', salary: '$180K - $250K', is_remote: false },
    { title: 'DevOps Engineer', company: 'Spotify', location: 'Remote', job_type: 'Full-time', salary: '$140K - $180K', is_remote: true },
    { title: 'Senior React Developer', company: 'Shopify', location: 'Remote', job_type: 'Full-time', salary: '$160K - $200K', is_remote: true },
    { title: 'Node.js Developer', company: 'Uber', location: 'San Francisco', job_type: 'Full-time', salary: '$150K - $190K', is_remote: false },
    { title: 'Python Engineer', company: 'Dropbox', location: 'Remote', job_type: 'Full-time', salary: '$140K - $180K', is_remote: true },
    { title: 'Frontend Intern', company: 'Microsoft', location: 'Redmond, WA', job_type: 'Internship', salary: '$45/hr', is_remote: false },
    { title: 'Cloud Engineer', company: 'Amazon', location: 'Seattle, WA', job_type: 'Full-time', salary: '$160K - $220K', is_remote: false },
    { title: 'Mobile Developer', company: 'Apple', location: 'Cupertino, CA', job_type: 'Full-time', salary: '$170K - $230K', is_remote: false },
];

async function seedJobs() {
    const client = await pool.connect();

    try {
        console.log('🌱 Seeding jobs...\n');

        // Check if jobs already exist
        const existing = await client.query('SELECT COUNT(*) FROM jobs');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log(`⏭️  Jobs table already has ${existing.rows[0].count} entries. Skipping seed.`);
            console.log('   To reseed, truncate the jobs table first.\n');
            return;
        }

        for (const job of JOBS) {
            await client.query(`
                INSERT INTO jobs (title, company, location, job_type, salary, is_remote)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [job.title, job.company, job.location, job.job_type, job.salary, job.is_remote]);
            console.log(`✅ Added: ${job.title} at ${job.company}`);
        }

        console.log(`\n🎉 Successfully seeded ${JOBS.length} jobs!`);

    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seedJobs();
