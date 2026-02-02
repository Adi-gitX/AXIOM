import { query } from '../config/db.js';

/**
 * Get all posts with filtering
 */
export const getAllPosts = async (req, res) => {
    try {
        const { source, limit = 20, offset = 0 } = req.query;

        let sql = `SELECT * FROM posts WHERE is_active = true`;
        const params = [];
        let paramIndex = 1;

        if (source && source !== 'All') {
            sql += ` AND source_name = $${paramIndex++}`;
            params.push(source);
        }

        sql += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(parseInt(limit), parseInt(offset));

        const result = await query(sql, params);

        res.json(result.rows);
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

        res.json(result.rows[0]);
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

        // Get current vote if exists
        const existing = await query(`
            SELECT vote_type FROM post_interactions 
            WHERE user_email = $1 AND post_id = $2
        `, [email, id]);

        const oldVote = existing.rows[0]?.vote_type;

        // Update interaction
        if (voteType === 'none') {
            await query(`
                UPDATE post_interactions 
                SET vote_type = NULL 
                WHERE user_email = $1 AND post_id = $2
            `, [email, id]);
        } else {
            await query(`
                INSERT INTO post_interactions (user_email, post_id, vote_type)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_email, post_id) DO UPDATE SET
                    vote_type = $3
            `, [email, id, voteType]);
        }

        // Update post vote counts
        let upvoteDelta = 0;
        let downvoteDelta = 0;

        // Remove old vote
        if (oldVote === 'up') upvoteDelta--;
        if (oldVote === 'down') downvoteDelta--;

        // Add new vote
        if (voteType === 'up') upvoteDelta++;
        if (voteType === 'down') downvoteDelta++;

        if (upvoteDelta !== 0 || downvoteDelta !== 0) {
            await query(`
                UPDATE posts SET
                    upvotes = upvotes + $2,
                    downvotes = downvotes + $3
                WHERE id = $1
            `, [id, upvoteDelta, downvoteDelta]);
        }

        // Get updated post
        const postResult = await query(
            'SELECT upvotes, downvotes FROM posts WHERE id = $1',
            [id]
        );

        res.json({
            postId: parseInt(id),
            voteType,
            upvotes: postResult.rows[0].upvotes,
            downvotes: postResult.rows[0].downvotes
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

        const existing = await query(`
            SELECT is_saved FROM post_interactions 
            WHERE user_email = $1 AND post_id = $2
        `, [email, id]);

        const wasSaved = existing.rows[0]?.is_saved || false;
        const newSaved = !wasSaved;

        await query(`
            INSERT INTO post_interactions (user_email, post_id, is_saved)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_email, post_id) DO UPDATE SET
                is_saved = $3
        `, [email, id, newSaved]);

        res.json({ postId: parseInt(id), saved: newSaved });
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

        // Convert to object for easy lookup
        const interactions = {};
        result.rows.forEach(row => {
            interactions[row.post_id] = {
                voteType: row.vote_type,
                saved: row.is_saved
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
        const { id } = req.params;

        const result = await query(`
            SELECT 
                id,
                user_name as author_name,
                user_avatar as author_avatar,
                content,
                upvotes,
                created_at as time
            FROM post_comments
            WHERE post_id = $1 AND is_deleted = false
            ORDER BY created_at ASC
        `, [id]);

        res.json(result.rows);
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
        const { id } = req.params;
        const { email, content, userName, userAvatar } = req.body;

        const result = await query(`
            INSERT INTO post_comments (post_id, user_email, user_name, user_avatar, content)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, user_name as author_name, user_avatar as author_avatar, content, upvotes, created_at as time
        `, [id, email, userName || email.split('@')[0], userAvatar, content]);

        // Update comment count on post
        await query(`
            UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1
        `, [id]);

        res.json(result.rows[0]);
    } catch (err) {
        console.error('addComment error:', err.message);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};
