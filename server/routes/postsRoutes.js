import express from 'express';
import {
    getAllPosts,
    getPostById,
    voteOnPost,
    toggleSavePost,
    getUserPostInteractions,
    getComments,
    addComment
} from '../controllers/postsController.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get all posts
router.get('/', getAllPosts);

// Get user's interactions with posts
router.get('/interactions/:email', getUserPostInteractions);

// Get single post
router.get('/:id', getPostById);

// Vote on a post
router.post('/:id/vote', validate(schemas.postVote), voteOnPost);

// Save/unsave a post
router.post('/:id/save', toggleSavePost);

// Get comments for a post
router.get('/:id/comments', getComments);

// Add a comment
router.post('/:id/comments', addComment);

export default router;
