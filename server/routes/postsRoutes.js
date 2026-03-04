import express from 'express';
import {
    getAllPosts,
    getPostById,
    voteOnPost,
    toggleSavePost,
    getUserPostInteractions,
    getComments,
    addComment,
    createPost
} from '../controllers/postsController.js';
import { validate, schemas } from '../middleware/validation.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

// Get all posts
router.get('/', getAllPosts);

// Get user's interactions with posts
router.get('/interactions/:email', requireVerifiedUser, getUserPostInteractions);

// Get single post
router.get('/:id', getPostById);

// Create a new post
router.post('/', requireVerifiedUser, validate(schemas.postCreate), createPost);

// Vote on a post
router.post('/:id/vote', requireVerifiedUser, validate(schemas.postVote), voteOnPost);

// Save/unsave a post
router.post('/:id/save', requireVerifiedUser, toggleSavePost);

// Get comments for a post
router.get('/:id/comments', getComments);

// Add a comment
router.post('/:id/comments', requireVerifiedUser, addComment);

export default router;
