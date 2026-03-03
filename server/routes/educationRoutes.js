import express from 'express';
import {
    getEducationCatalog,
    getEducationProgress,
    markVideoWatched,
    updateWatchProgress,
    getTopicProgress,
    getRecentlyWatched
} from '../controllers/educationController.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

// Get education catalog
router.get('/catalog', getEducationCatalog);

// Get user's education progress
router.get('/progress/:email', requireVerifiedUser, getEducationProgress);

// Mark video as watched
router.post('/watched', requireVerifiedUser, markVideoWatched);

// Update watch progress (percentage)
router.post('/progress', requireVerifiedUser, updateWatchProgress);

// Get progress by topic
router.get('/topics/:email', requireVerifiedUser, getTopicProgress);

// Get recently watched
router.get('/recent/:email', requireVerifiedUser, getRecentlyWatched);

export default router;
