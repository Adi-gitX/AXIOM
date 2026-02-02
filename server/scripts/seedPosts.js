import pg from 'pg';
import dotenvx from '@dotenvx/dotenvx';

dotenvx.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Seed posts data
const POSTS = [
    {
        source_name: 'Y Combinator',
        source_icon: 'Y',
        source_color: '#FF6600',
        title: 'coder/ghostty-web: Ghostty for the web with xterm.js API compatibility',
        description: 'Ghostty is a cross-platform, GPU-accelerated terminal emulator that aims to be both faster and more feature-rich than competitors.',
        author_name: 'coder',
        published_at: '3w ago',
        github_stats: JSON.stringify({ contributors: 4, issues: 0, stars: 209, forks: 9 }),
        upvotes: 59,
        comments_count: 1
    },
    {
        source_name: 'Dev.to',
        source_icon: 'D',
        source_color: '#0A0A0A',
        title: 'Building Scalable React Applications with Modern Architecture Patterns',
        description: 'A comprehensive guide to structuring large React applications using modern patterns like compound components and custom hooks.',
        author_name: 'sarah_dev',
        published_at: '2d ago',
        github_stats: JSON.stringify({ contributors: 1600, issues: 850, stars: 218000, forks: 46000 }),
        upvotes: 284,
        comments_count: 42
    },
    {
        source_name: 'Hacker News',
        source_icon: 'H',
        source_color: '#FF6600',
        title: 'The Future of CSS: Container Queries, Cascade Layers, and Beyond',
        description: 'Exploring the latest CSS features that are changing how we approach responsive design and component styling.',
        author_name: 'cssmaster',
        published_at: '1w ago',
        github_stats: JSON.stringify({ contributors: 89, issues: 2100, stars: 4200, forks: 650 }),
        upvotes: 156,
        comments_count: 28
    },
    {
        source_name: 'Medium',
        source_icon: 'M',
        source_color: '#000000',
        title: 'System Design Interview: Building a Real-time Notification System',
        description: 'A deep dive into designing a scalable notification system that can handle millions of users and real-time updates.',
        author_name: 'arch_expert',
        published_at: '5d ago',
        github_stats: JSON.stringify({ contributors: 120, issues: 210, stars: 245000, forks: 42000 }),
        upvotes: 421,
        comments_count: 67
    },
    {
        source_name: 'Reddit',
        source_icon: 'R',
        source_color: '#FF4500',
        title: 'TypeScript 5.4: Everything New You Need to Know About',
        description: 'Breaking down the new features in TypeScript 5.4 including NoInfer, improved narrowing, and Object.groupBy support.',
        author_name: 'ts_enthusiast',
        published_at: '4d ago',
        github_stats: JSON.stringify({ contributors: 800, issues: 5400, stars: 97000, forks: 12000 }),
        upvotes: 198,
        comments_count: 35
    },
    {
        source_name: 'GitHub',
        source_icon: 'G',
        source_color: '#24292F',
        title: 'Building AI-Powered Features with OpenAI GPT-4 API Integration',
        description: 'Practical examples and best practices for integrating GPT-4 into your applications with streaming responses.',
        author_name: 'ai_builder',
        published_at: '1d ago',
        github_stats: JSON.stringify({ contributors: 45, issues: 89, stars: 5600, forks: 780 }),
        upvotes: 567,
        comments_count: 89
    }
];

async function seedPosts() {
    const client = await pool.connect();

    try {
        console.log('🌱 Seeding posts...\n');

        // Check if posts already exist
        const existing = await client.query('SELECT COUNT(*) FROM posts');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log(`⏭️  Posts table already has ${existing.rows[0].count} entries. Skipping seed.`);
            console.log('   To reseed, truncate the posts table first.\n');
            return;
        }

        for (const post of POSTS) {
            await client.query(`
                INSERT INTO posts (source_name, source_icon, source_color, title, description, author_name, published_at, github_stats, upvotes, comments_count)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `, [
                post.source_name, post.source_icon, post.source_color,
                post.title, post.description, post.author_name,
                post.published_at, post.github_stats, post.upvotes, post.comments_count
            ]);
            console.log(`✅ Added: ${post.title.substring(0, 50)}...`);
        }

        console.log(`\n🎉 Successfully seeded ${POSTS.length} posts!`);

    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

seedPosts();
