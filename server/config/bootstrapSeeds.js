/**
 * Auto-seed on boot — ensures jobs and posts tables have data on cold start.
 * Idempotent: only inserts if the table is empty.
 * Single-writer (boot-time) — no race with the running backend.
 */
import { query } from './db.js';

const JOBS_SEED = [
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

const POSTS_SEED = [
    { source_name: 'HackerNews', source_icon: 'Y', source_color: '#FF6600', title: 'Show HN: AXIOM — open-source dev career platform', author_name: 'adi-gitx', read_time: '4m read', upvotes: 142 },
    { source_name: 'Dev.to',     source_icon: 'D', source_color: '#0A0A0A', title: 'Why I built AXIOM as a single Vite + Express monorepo', author_name: 'adi-gitx', read_time: '8m read', upvotes: 56 },
    { source_name: 'Reddit',     source_icon: 'R', source_color: '#FF4500', title: 'How I went from 0 to 47-day DSA streak', author_name: 'striver_fan', read_time: '3m read', upvotes: 89 },
    { source_name: 'GitHub',     source_icon: 'G', source_color: '#181717', title: 'AXIOM v1.2 released — command palette + painterly theme', author_name: 'releases', read_time: '2m read', upvotes: 34 },
];

const INTERVIEW_EXPERIENCES_SEED = [
    { company: 'Google', role: 'Software Engineering Intern', rounds: 3, problems: 3, result: 'Selected', difficulty: 'Medium', location: 'Remote', experience_years: '0-1', author_name: 'Agrawal', author_role: 'Final-year student', quote: "Google interviews are fast-paced and time-bound, so it is crucial to practice with that environment in mind. Don't underestimate edge case discussions, dry runs, and being able to explain your solution with confidence.", upvotes: 375 },
    { company: 'Amazon', role: 'SDE Intern (6M)', rounds: 1, problems: 2, result: 'Selected', difficulty: 'Medium-Hard', location: 'Remote', experience_years: '0-1', author_name: 'Anonymous', author_role: 'SDE Intern', quote: "Don't panic due to lack of preparation, even I panicked but realized I can never be fully prepared. It's a continuous process. Even after cracking jobs, you'll always be preparing.", upvotes: 223 },
    { company: 'Amazon', role: 'Software Development Engineer I', rounds: 5, problems: 5, result: 'Ghosted', difficulty: 'Medium', location: 'Remote', experience_years: '0-1', author_name: 'Anonymous', author_role: 'Software Engineer at a Startup', quote: 'For the SDE-I interview, a strong balance of DSA, leadership principles, and basic system design is key. Solve in patterns, not individually. Talk through your approach — never sit silent even if stuck.', upvotes: 164 },
    { company: 'Amazon', role: 'SDE-2 (Level 5)', rounds: 5, problems: 2, result: 'Selected', difficulty: 'Hard', location: 'Remote', experience_years: '3-4', author_name: 'Anonymous', author_role: 'Software Engineer II at PayPal', quote: 'Expect every round to include Leadership Principle questions — treat them with equal importance as coding. For LLD/HLD, think from a real product perspective: how would this scale, what would break, what trade-offs are you accepting?', upvotes: 73 },
    { company: 'Google', role: 'Software Engineer (L4)', rounds: 5, problems: 0, result: 'Rejected', difficulty: 'Medium', location: 'Remote', experience_years: '2-3', author_name: 'Anonymous', author_role: 'Software Engineer at PBC', quote: "This experience humbled me. Solving problems quickly isn't enough — you must truly understand them, reflect on failures, and grow. Don't ignore fundamentals. Rushing through DSA in college and not revisiting cost me this opportunity.", upvotes: 70 },
    { company: 'Microsoft', role: 'Software Engineer 2', rounds: 4, problems: 3, result: 'Selected', difficulty: 'Medium', location: 'Hybrid', experience_years: '1-2', author_name: 'Riya M.', author_role: 'SE-II at Microsoft', quote: 'Be authentic in behavioral rounds. Microsoft cares about how you collaborate and grow, not just how fast you solve. Coding rounds were balanced — string manipulation, BFS/DFS, and a system design discussion.', upvotes: 58 },
    { company: 'Meta', role: 'E4 Software Engineer', rounds: 5, problems: 4, result: 'Selected', difficulty: 'Hard', location: 'On-site', experience_years: '3-4', author_name: 'Anonymous', author_role: 'E4 at Meta', quote: 'Meta loop = 2 coding + 1 system design + 1 behavioral. Coding is graph and DP heavy. System design wants you to lead — make decisions, justify them. Behavioral wants concrete examples with measurable outcomes.', upvotes: 45 },
    { company: 'Stripe', role: 'Software Engineer (Backend)', rounds: 4, problems: 2, result: 'Selected', difficulty: 'Medium', location: 'Remote', experience_years: '1-2', author_name: 'Anonymous', author_role: 'Backend Engineer at Stripe', quote: 'Stripe rounds are practical — read real code, debug it, extend it. They care more about API design and edge cases than algorithmic gymnastics. Bug-bash round was the differentiator for me.', upvotes: 39 },
    { company: 'Uber', role: 'Software Engineer', rounds: 5, problems: 3, result: 'Selected', difficulty: 'Medium', location: 'Hybrid', experience_years: '2-3', author_name: 'Karthik R.', author_role: 'SE at Uber', quote: 'Two coding, one HLD, one LLD, one bar-raiser. LLD on a parking lot felt cliché but they push hard on extensibility. Bar-raiser asked about a project failure — be honest, talk about what you learned.', upvotes: 36 },
    { company: 'Goldman Sachs', role: 'Analyst (Engineering)', rounds: 3, problems: 4, result: 'Selected', difficulty: 'Medium', location: 'On-site', experience_years: '0-1', author_name: 'Anonymous', author_role: 'Analyst at Goldman Sachs', quote: 'OOP design questions, Java memory model, and a heavy emphasis on multithreading. The HR round mattered — they wanted to understand if I genuinely cared about finance, not just the brand.', upvotes: 32 },
    { company: 'PhonePe', role: 'SDE-1', rounds: 4, problems: 3, result: 'Selected', difficulty: 'Medium', location: 'On-site', experience_years: '0-1', author_name: 'Anonymous', author_role: 'SDE-1 at PhonePe', quote: "Two DSA rounds were graph + DP heavy. LLD was wallet-design (UPI flow). HM round asked 'what would you build at PhonePe and why' — having a clear answer mattered.", upvotes: 29 },
    { company: 'Microsoft', role: 'Software Engineer Intern', rounds: 3, problems: 4, result: 'Selected', difficulty: 'Medium', location: 'Remote', experience_years: '0-1', author_name: 'Anonymous', author_role: 'SE Intern', quote: "Online assessment had 4 questions — 1 easy, 2 medium, 1 hard. Tech round was DP-heavy. HR round was super conversational, just be yourself.", upvotes: 27 },
    { company: 'Apple', role: 'Software Engineer (iOS)', rounds: 6, problems: 4, result: 'Rejected', difficulty: 'Hard', location: 'On-site', experience_years: '4-5', author_name: 'Anonymous', author_role: 'iOS Developer', quote: 'Apple loops are exhausting. 6 back-to-back rounds — DSA, system design, iOS internals, debugging, behavioral, and a final architecture round. Got rejected on the architecture round but learned more in 6 hours than 6 months elsewhere.', upvotes: 24 },
    { company: 'Atlassian', role: 'Software Engineer', rounds: 4, problems: 3, result: 'Selected', difficulty: 'Medium', location: 'Remote', experience_years: '2-3', author_name: 'Anonymous', author_role: 'SE at Atlassian', quote: 'Atlassian values clarity over cleverness. Coding round had a real-world string parser problem — they wanted clean, readable, well-tested code. System design was a Kanban-board scaling discussion.', upvotes: 21 },
    { company: 'Walmart', role: 'SDE-3', rounds: 5, problems: 2, result: 'Selected', difficulty: 'Hard', location: 'Hybrid', experience_years: '5-6', author_name: 'Anonymous', author_role: 'SDE-3 at Walmart Global Tech', quote: 'Walmart rounds were heavy on system design and database internals. SQL deep-dive (sharding, indexing, query plans) caught me off-guard. Came out grateful for the rigor.', upvotes: 18 },
];

const seedJobsIfEmpty = async () => {
    try {
        const existing = await query('SELECT COUNT(*) as count FROM jobs WHERE is_active = 1');
        const count = Number(existing.rows[0]?.count || 0);
        if (count > 0) return { seeded: false, count };

        for (const j of JOBS_SEED) {
            await query(
                `INSERT INTO jobs (title, company, location, job_type, salary, is_remote, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6, 1)`,
                [j.title, j.company, j.location, j.job_type, j.salary, j.is_remote]
            );
        }
        console.log(`[seed] auto-seeded ${JOBS_SEED.length} jobs`);
        return { seeded: true, count: JOBS_SEED.length };
    } catch (err) {
        console.warn('[seed] jobs auto-seed skipped:', err?.message || err);
        return { seeded: false, error: err?.message };
    }
};

const seedPostsIfEmpty = async () => {
    try {
        const existing = await query('SELECT COUNT(*) as count FROM posts WHERE is_active = 1');
        const count = Number(existing.rows[0]?.count || 0);
        if (count > 0) return { seeded: false, count };

        const now = new Date().toISOString();
        for (const p of POSTS_SEED) {
            await query(
                `INSERT INTO posts (source_name, source_icon, source_color, title, author_name, author_avatar, published_at, read_time, upvotes, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 1)`,
                [
                    p.source_name,
                    p.source_icon,
                    p.source_color,
                    p.title,
                    p.author_name,
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(p.author_name)}`,
                    now,
                    p.read_time,
                    p.upvotes,
                ]
            );
        }
        console.log(`[seed] auto-seeded ${POSTS_SEED.length} posts`);
        return { seeded: true, count: POSTS_SEED.length };
    } catch (err) {
        console.warn('[seed] posts auto-seed skipped:', err?.message || err);
        return { seeded: false, error: err?.message };
    }
};

export const runBootstrapSeeds = async () => {
    const [jobsResult, postsResult, interviewResult] = await Promise.all([
        seedJobsIfEmpty(),
        seedPostsIfEmpty(),
        seedInterviewExperiencesIfEmpty(),
    ]);
    return { jobs: jobsResult, posts: postsResult, interviews: interviewResult };
};

const seedInterviewExperiencesIfEmpty = async () => {
    try {
        await query(`
            CREATE TABLE IF NOT EXISTS interview_experiences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                company TEXT NOT NULL,
                role TEXT NOT NULL,
                rounds INTEGER DEFAULT 0,
                problems INTEGER DEFAULT 0,
                result TEXT DEFAULT 'Selected',
                difficulty TEXT DEFAULT 'Medium',
                location TEXT DEFAULT 'Remote',
                experience_years TEXT DEFAULT '0-1',
                author_name TEXT NOT NULL,
                author_role TEXT,
                quote TEXT NOT NULL,
                upvotes INTEGER DEFAULT 0,
                posted_at TEXT DEFAULT CURRENT_TIMESTAMP,
                is_active INTEGER DEFAULT 1
            )
        `);
        const existing = await query('SELECT COUNT(*) as count FROM interview_experiences WHERE is_active = 1');
        const count = Number(existing.rows[0]?.count || 0);
        if (count > 0) return { seeded: false, count };

        const now = new Date().toISOString();
        for (const e of INTERVIEW_EXPERIENCES_SEED) {
            await query(
                `INSERT INTO interview_experiences
                 (company, role, rounds, problems, result, difficulty, location, experience_years, author_name, author_role, quote, upvotes, posted_at, is_active)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,1)`,
                [e.company, e.role, e.rounds, e.problems, e.result, e.difficulty, e.location, e.experience_years, e.author_name, e.author_role, e.quote, e.upvotes, now]
            );
        }
        console.log(`[seed] auto-seeded ${INTERVIEW_EXPERIENCES_SEED.length} interview experiences`);
        return { seeded: true, count: INTERVIEW_EXPERIENCES_SEED.length };
    } catch (err) {
        console.warn('[seed] interview experiences auto-seed skipped:', err?.message || err);
        return { seeded: false, error: err?.message };
    }
};

export default { runBootstrapSeeds };
