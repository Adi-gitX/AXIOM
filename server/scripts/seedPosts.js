import { query } from '../config/db.js';
import { loadEnv } from '../config/loadEnv.js';

loadEnv();

const POSTS = [
    {
        source_name: 'Y Combinator',
        source_icon: 'Y',
        source_color: '#FF6600',
        title: 'coder/ghostty-web: Ghostty for the web with xterm.js API compatibility',
        description: 'Ghostty is a cross-platform, GPU-accelerated terminal emulator that aims to be both faster and more feature-rich than competitors.',
        author_name: 'coder',
        published_at: '3w ago',
        github_stats: { contributors: 4, issues: 0, stars: 209, forks: 9 },
        upvotes: 59,
        comments_count: 1,
        tags: ['terminal', 'web', 'opensource'],
    },
    {
        source_name: 'Dev.to',
        source_icon: 'D',
        source_color: '#0A0A0A',
        title: 'Building Scalable React Applications with Modern Architecture Patterns',
        description: 'A guide to structuring larger React applications with reusable patterns.',
        author_name: 'sarah_dev',
        published_at: '2d ago',
        github_stats: { contributors: 1600, issues: 850, stars: 218000, forks: 46000 },
        upvotes: 284,
        comments_count: 42,
        tags: ['react', 'architecture'],
    },
    {
        source_name: 'Hacker News',
        source_icon: 'H',
        source_color: '#FF6600',
        title: 'The Future of CSS: Container Queries, Cascade Layers, and Beyond',
        description: 'Latest CSS features changing responsive design and component styling.',
        author_name: 'cssmaster',
        published_at: '1w ago',
        github_stats: { contributors: 89, issues: 2100, stars: 4200, forks: 650 },
        upvotes: 156,
        comments_count: 28,
        tags: ['css', 'frontend'],
    },
    {
        source_name: 'Medium',
        source_icon: 'M',
        source_color: '#000000',
        title: 'System Design Interview: Building a Real-time Notification System',
        description: 'Designing a scalable notification system for millions of users.',
        author_name: 'arch_expert',
        published_at: '5d ago',
        github_stats: { contributors: 120, issues: 210, stars: 245000, forks: 42000 },
        upvotes: 421,
        comments_count: 67,
        tags: ['system-design', 'architecture'],
    },
    {
        source_name: 'GitHub',
        source_icon: 'G',
        source_color: '#24292F',
        title: 'Building AI-Powered Features with OpenAI API Integration',
        description: 'Practical patterns for integrating LLM features with streaming responses.',
        author_name: 'ai_builder',
        published_at: '1d ago',
        github_stats: { contributors: 45, issues: 89, stars: 5600, forks: 780 },
        upvotes: 567,
        comments_count: 89,
        tags: ['ai', 'api'],
    },
];

const seedPosts = async () => {
    try {
        console.log('🌱 Seeding posts...');

        const existing = await query('SELECT COUNT(*) as count FROM posts');
        const count = Number(existing.rows[0]?.count || 0);
        if (count > 0) {
            console.log(`⏭️  Posts table already has ${count} rows. Skipping.`);
            return;
        }

        for (const post of POSTS) {
            await query(`
                INSERT INTO posts (
                    source_name, source_icon, source_color,
                    title, description, author_name,
                    published_at, github_stats, tags,
                    upvotes, comments_count
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `, [
                post.source_name,
                post.source_icon,
                post.source_color,
                post.title,
                post.description,
                post.author_name,
                post.published_at,
                JSON.stringify(post.github_stats),
                JSON.stringify(post.tags || []),
                post.upvotes,
                post.comments_count,
            ]);
            console.log(`✅ Added: ${post.title.substring(0, 60)}...`);
        }

        console.log(`🎉 Seeded ${POSTS.length} posts`);
    } catch (err) {
        console.error('❌ Failed to seed posts:', err.message);
        process.exit(1);
    }
};

seedPosts();
