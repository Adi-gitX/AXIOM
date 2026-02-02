import express from 'express';
import {
    getUserProgress,
    toggleProblem,
    getActivityHeatmap,
    logStudyTime,
    getDashboardStats
} from '../controllers/progressController.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get user progress data
router.get('/:email', getUserProgress);

// Toggle problem solved/unsolved
router.post('/problem', validate(schemas.problemToggle), toggleProblem);

// Get activity heatmap
router.get('/heatmap/:email', getActivityHeatmap);

// Log study time
router.post('/study-time', logStudyTime);

// Get dashboard stats
router.get('/dashboard/:email', getDashboardStats);

export default router;
