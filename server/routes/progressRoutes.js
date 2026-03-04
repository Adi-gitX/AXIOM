import express from 'express';
import {
    getUserProgress,
    toggleProblem,
    getActivityHeatmap,
    logStudyTime,
    getDashboardStats,
    getDsaCatalog,
    getDailyFocus,
    getProblemMetaForUser,
    upsertProblemMetaForUser,
    completeProblemReview,
    getReviewToday,
} from '../controllers/progressController.js';
import { validate, schemas } from '../middleware/validation.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

// Catalog and aggregate data
router.get('/catalog', getDsaCatalog);
router.use(requireVerifiedUser);
router.get('/heatmap/:email', getActivityHeatmap);
router.get('/dashboard/:email', getDashboardStats);
router.get('/focus/:email', getDailyFocus);

// DSA journal + spaced repetition
router.get('/problem-meta/:email', getProblemMetaForUser);
router.post('/problem-meta', validate(schemas.problemMetaUpsert), upsertProblemMetaForUser);
router.get('/review/:email', getReviewToday);
router.post('/review/complete', validate(schemas.problemReviewComplete), completeProblemReview);

// Progress mutation endpoints
router.post('/problem', validate(schemas.problemToggle), toggleProblem);
router.post('/study-time', logStudyTime);

// User progress snapshot (keep last to avoid route conflicts)
router.get('/:email', getUserProgress);

export default router;
