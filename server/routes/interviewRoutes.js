import express from 'express';
import {
    getInterviewResources,
    getInterviewProgress,
    setInterviewResourceCompletion,
} from '../controllers/interviewController.js';
import { validate, schemas } from '../middleware/validation.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/resources', getInterviewResources);
router.get('/progress/:email', requireVerifiedUser, getInterviewProgress);
router.post('/resources/:id/complete', requireVerifiedUser, validate(schemas.interviewComplete), setInterviewResourceCompletion);

export default router;
