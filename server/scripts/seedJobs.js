import { query } from '../config/db.js';
import { loadEnv } from '../config/loadEnv.js';

loadEnv();

const JOBS = [
    { title: 'Frontend Developer', company: 'Google', location: 'Remote', job_type: 'Full-time', salary: '$150K - $200K', is_remote: 1 },
    { title: 'Backend Engineer', company: 'Meta', location: 'Menlo Park, CA', job_type: 'Full-time', salary: '$170K - $220K', is_remote: 0 },
    { title: 'Full Stack Developer', company: 'Stripe', location: 'San Francisco', job_type: 'Full-time', salary: '$160K - $210K', is_remote: 0 },
    { title: 'React Developer', company: 'Airbnb', location: 'Remote', job_type: 'Contract', salary: '$80/hr', is_remote: 1 },
    { title: 'Software Engineer', company: 'Netflix', location: 'Los Gatos, CA', job_type: 'Full-time', salary: '$180K - $250K', is_remote: 0 },
    { title: 'DevOps Engineer', company: 'Spotify', location: 'Remote', job_type: 'Full-time', salary: '$140K - $180K', is_remote: 1 },
    { title: 'Senior React Developer', company: 'Shopify', location: 'Remote', job_type: 'Full-time', salary: '$160K - $200K', is_remote: 1 },
    { title: 'Node.js Developer', company: 'Uber', location: 'San Francisco', job_type: 'Full-time', salary: '$150K - $190K', is_remote: 0 },
    { title: 'Python Engineer', company: 'Dropbox', location: 'Remote', job_type: 'Full-time', salary: '$140K - $180K', is_remote: 1 },
    { title: 'Frontend Intern', company: 'Microsoft', location: 'Redmond, WA', job_type: 'Internship', salary: '$45/hr', is_remote: 0 },
    { title: 'Cloud Engineer', company: 'Amazon', location: 'Seattle, WA', job_type: 'Full-time', salary: '$160K - $220K', is_remote: 0 },
    { title: 'Mobile Developer', company: 'Apple', location: 'Cupertino, CA', job_type: 'Full-time', salary: '$170K - $230K', is_remote: 0 },
];

const seedJobs = async () => {
    try {
        console.log('🌱 Seeding jobs...');

        const existing = await query('SELECT COUNT(*) as count FROM jobs');
        const count = Number(existing.rows[0]?.count || 0);
        if (count > 0) {
            console.log(`⏭️  Jobs table already has ${count} rows. Skipping.`);
            return;
        }

        for (const job of JOBS) {
            await query(`
                INSERT INTO jobs (title, company, location, job_type, salary, is_remote, is_active)
                VALUES ($1, $2, $3, $4, $5, $6, 1)
            `, [job.title, job.company, job.location, job.job_type, job.salary, job.is_remote]);
            console.log(`✅ Added: ${job.title} at ${job.company}`);
        }

        console.log(`🎉 Seeded ${JOBS.length} jobs`);
    } catch (err) {
        console.error('❌ Failed to seed jobs:', err.message);
        process.exit(1);
    }
};

seedJobs();
