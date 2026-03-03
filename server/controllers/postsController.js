import { query } from '../config/db.js';

const toInt = (value, fallback = 0) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value) => value === true || value === 1 || value === '1';

const parseJson = (value, fallback = null) => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return value;
    if (typeof value !== 'string') return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const parseTags = (tags) => {
    const parsed = parseJson(tags, []);
    return Array.isArray(parsed) ? parsed : [];
};

const normalizePost = (post, interaction = null) => {
    const tags = parseTags(post.tags);
    const voteType = interaction?.vote_type ?? null;
    const userVote = voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0;

    return {
        ...post,
        id: toInt(post.id),
        upvotes: toInt(post.upvotes),
        downvotes: toInt(post.downvotes),
        comments_count: toInt(post.comments_count),
        is_active: toBool(post.is_active),
        source: {
            name: post.source_name || 'AXIOM',
            icon: post.source_icon || 'A',
            color: post.source_color || '#6366f1',
        },
        author: {
            name: post.author_name || 'Anonymous',
            avatar: post.author_avatar,
        },
        tags,
        user_vote: userVote,
        is_saved: interaction ? toBool(interaction.is_saved) : false,
    };
};

const buildOrderBy = (sort) => {
    switch (sort) {
        case 'popular':
            return 'ORDER BY (upvotes - downvotes) DESC, comments_count DESC, created_at DESC';
        case 'trending':
            return 'ORDER BY (upvotes + comments_count * 2 - downvotes) DESC, created_at DESC';
        case 'recent':
        default:
            return 'ORDER BY created_at DESC';
    }
};

/**
 * Get all posts with filtering
 */
export const getAllPosts = async (req, res) => {
    try {
        const {
            source,
            sort = 'recent',
            email,
            limit = 20,
            offset = 0,
        } = req.query;

        const safeLimit = Math.min(100, Math.max(1, toInt(limit, 20)));
        const safeOffset = Math.max(0, toInt(offset, 0));

        const params = [];
        let paramIndex = 1;
        let sql = 'SELECT * FROM posts WHERE is_active = 1';

        if (source && source !== 'All') {
            sql += ` AND source_name = $${paramIndex++}`;
            params.push(source);
        }

        sql += ` ${buildOrderBy(sort)} LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(safeLimit, safeOffset);

        const result = await query(sql, params);

        let interactionsByPostId = {};
        if (email && result.rows.length > 0) {
            const postIds = result.rows.map((row) => toInt(row.id)).filter(Boolean);
            const placeholders = postIds.map((_, index) => `$${index + 2}`).join(', ');
            const interactionResult = await query(`
                SELECT post_id, vote_type, is_saved
                FROM post_interactions
                WHERE user_email = $1 AND post_id IN (${placeholders})
            `, [email, ...postIds]);

            interactionsByPostId = interactionResult.rows.reduce((acc, row) => {
                acc[toInt(row.post_id)] = row;
                return acc;
            }, {});
        }

        const formattedPosts = result.rows.map((post) =>
            normalizePost(post, interactionsByPostId[toInt(post.id)] || null)
        );

        res.json(formattedPosts);
    } catch (err) {
        console.error('getAllPosts error:', err.message);
        res.status(500).json({ error: 'Failed to get posts' });
    }
};

/**
 * Get a single post
 */
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM posts WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(normalizePost(result.rows[0]));
    } catch (err) {
        console.error('getPostById error:', err.message);
        res.status(500).json({ error: 'Failed to get post' });
    }
};

/**
 * Vote on a post
 */
export const voteOnPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, voteType } = req.body; // 'up', 'down', or 'none'

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const postId = toInt(id);
        if (!postId) {
            return res.status(400).json({ error: 'Invalid post id' });
        }

        const existing = await query(`
            SELECT vote_type FROM post_interactions
            WHERE user_email = $1 AND post_id = $2
        `, [email, postId]);

        const oldVote = existing.rows[0]?.vote_type || null;

        if (voteType === 'none') {
            await query(`
                INSERT INTO post_interactions (user_email, post_id, vote_type)
                VALUES ($1, $2, NULL)
                ON CONFLICT (user_email, post_id) DO UPDATE SET
                    vote_type = NULL
            `, [email, postId]);
        } else {
            await query(`
                INSERT INTO post_interactions (user_email, post_id, vote_type)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_email, post_id) DO UPDATE SET
                    vote_type = $3
            `, [email, postId, voteType]);
        }

        let upvoteDelta = 0;
        let downvoteDelta = 0;

        if (oldVote === 'up') upvoteDelta -= 1;
        if (oldVote === 'down') downvoteDelta -= 1;
        if (voteType === 'up') upvoteDelta += 1;
        if (voteType === 'down') downvoteDelta += 1;

        if (upvoteDelta !== 0 || downvoteDelta !== 0) {
            await query(`
                UPDATE posts SET
                    upvotes = MAX(0, upvotes + $2),
                    downvotes = MAX(0, downvotes + $3)
                WHERE id = $1
            `, [postId, upvoteDelta, downvoteDelta]);
        }

        const postResult = await query(
            'SELECT upvotes, downvotes FROM posts WHERE id = $1',
            [postId]
        );

        const post = postResult.rows[0] || { upvotes: 0, downvotes: 0 };
        res.json({
            postId,
            voteType,
            upvotes: toInt(post.upvotes),
            downvotes: toInt(post.downvotes),
        });
    } catch (err) {
        console.error('voteOnPost error:', err.message);
        res.status(500).json({ error: 'Failed to vote on post' });
    }
};

/**
 * Save/unsave a post
 */
export const toggleSavePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const postId = toInt(id);
        if (!postId) {
            return res.status(400).json({ error: 'Invalid post id' });
        }

        const existing = await query(`
            SELECT is_saved FROM post_interactions
            WHERE user_email = $1 AND post_id = $2
        `, [email, postId]);

        const wasSaved = toBool(existing.rows[0]?.is_saved);
        const newSaved = !wasSaved;

        await query(`
            INSERT INTO post_interactions (user_email, post_id, is_saved)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_email, post_id) DO UPDATE SET
                is_saved = $3
        `, [email, postId, newSaved ? 1 : 0]);

        res.json({ postId, saved: newSaved });
    } catch (err) {
        console.error('toggleSavePost error:', err.message);
        res.status(500).json({ error: 'Failed to save post' });
    }
};

/**
 * Get user's interactions with posts (for hydrating UI state)
 */
export const getUserPostInteractions = async (req, res) => {
    try {
        const { email } = req.params;

        const result = await query(`
            SELECT post_id, vote_type, is_saved
            FROM post_interactions
            WHERE user_email = $1
        `, [email]);

        const interactions = {};
        result.rows.forEach((row) => {
            interactions[toInt(row.post_id)] = {
                voteType: row.vote_type || null,
                saved: toBool(row.is_saved),
            };
        });

        res.json(interactions);
    } catch (err) {
        console.error('getUserPostInteractions error:', err.message);
        res.status(500).json({ error: 'Failed to get interactions' });
    }
};

/**
 * Get comments for a post
 */
export const getComments = async (req, res) => {
    try {
        const postId = toInt(req.params.id);
        if (!postId) {
            return res.status(400).json({ error: 'Invalid post id' });
        }

        const result = await query(`
            SELECT
                id,
                user_name as author_name,
                user_avatar as author_avatar,
                content,
                upvotes,
                created_at as time
            FROM post_comments
            WHERE post_id = $1 AND is_deleted = 0
            ORDER BY created_at ASC
        `, [postId]);

        res.json(result.rows.map((row) => ({
            ...row,
            id: toInt(row.id),
            upvotes: toInt(row.upvotes),
        })));
    } catch (err) {
        console.error('getComments error:', err.message);
        res.status(500).json({ error: 'Failed to get comments' });
    }
};

/**
 * Add a comment to a post
 */
export const addComment = async (req, res) => {
    try {
        const postId = toInt(req.params.id);
        const { email, content, userName, userAvatar } = req.body;

        if (!postId || !email || !content?.trim()) {
            return res.status(400).json({ error: 'post id, email and content are required' });
        }

        const result = await query(`
            INSERT INTO post_comments (post_id, user_email, user_name, user_avatar, content)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, user_name as author_name, user_avatar as author_avatar, content, upvotes, created_at as time
        `, [postId, email, userName || email.split('@')[0], userAvatar || null, content.trim()]);

        let comment = result.rows[0];
        if (!comment) {
            const refetch = await query(`
                SELECT id, user_name as author_name, user_avatar as author_avatar, content, upvotes, created_at as time
                FROM post_comments
                WHERE post_id = $1
                ORDER BY id DESC
                LIMIT 1
            `, [postId]);
            comment = refetch.rows[0];
        }

        await query(`
            UPDATE posts
            SET comments_count = comments_count + 1
            WHERE id = $1
        `, [postId]);

        res.json({
            ...comment,
            id: toInt(comment.id),
            upvotes: toInt(comment.upvotes),
        });
    } catch (err) {
        console.error('addComment error:', err.message);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

/**
 * Create a new post
 */
export const createPost = async (req, res) => {
    try {
        const {
            email,
            title,
            content,
            tags = [],
            userName,
            userAvatar,
            externalUrl,
            githubStats,
        } = req.body;

        if (!email || !title?.trim()) {
            return res.status(400).json({ error: 'Email and title are required' });
        }

        const safeContent = (content || '').trim();
        const wordCount = safeContent ? safeContent.split(/\s+/).length : 0;
        const readTime = `${Math.max(1, Math.ceil(wordCount / 200))}m read`;
        const safeTags = Array.isArray(tags)
            ? tags.map((tag) => String(tag).trim()).filter(Boolean).slice(0, 15)
            : [];

        const result = await query(`
            INSERT INTO posts (
                source_name, source_icon, source_color,
                title, description,
                author_name, author_avatar,
                published_at, external_url, github_stats,
                tags, read_time
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `, [
            'AXIOM',
            'A',
            '#6366f1',
            title.trim(),
            safeContent,
            userName || email.split('@')[0],
            userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            new Date().toISOString(),
            externalUrl || null,
            githubStats ? JSON.stringify(githubStats) : null,
            JSON.stringify(safeTags),
            readTime,
        ]);

        let post = result.rows[0];
        if (!post) {
            const refetch = await query('SELECT * FROM posts ORDER BY id DESC LIMIT 1');
            post = refetch.rows[0];
        }

        const today = new Date().toISOString().split('T')[0];
        await query(`
            INSERT INTO user_activity (user_email, activity_date, problems_solved)
            VALUES ($1, $2, 0)
            ON CONFLICT (user_email, activity_date) DO UPDATE SET
                problems_solved = user_activity.problems_solved
        `, [email, today]).catch(() => { });

        res.status(201).json(normalizePost(post));
    } catch (err) {
        console.error('createPost error:', err.message);
        res.status(500).json({ error: 'Failed to create post' });
    }
};
