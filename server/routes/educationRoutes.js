import express from 'express';
import {
    getEducationProgress,
    markVideoWatched,
    updateWatchProgress,
    getTopicProgress,
    getRecentlyWatched
} from '../controllers/educationController.js';

const router = express.Router();

// Get user's education progress
router.get('/progress/:email', getEducationProgress);

// Mark video as watched
router.post('/watched', markVideoWatched);

// Update watch progress (percentage)
router.post('/progress', updateWatchProgress);

// Get progress by topic
router.get('/topics/:email', getTopicProgress);

// Get recently watched
router.get('/recent/:email', getRecentlyWatched);

export default router;
