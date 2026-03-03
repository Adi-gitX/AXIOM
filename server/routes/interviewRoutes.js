import express from 'express';
import {
    getInterviewResources,
    getInterviewProgress,
    setInterviewResourceCompletion,
} from '../controllers/interviewController.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

router.get('/resources', getInterviewResources);
router.get('/progress/:email', getInterviewProgress);
router.post('/resources/:id/complete', validate(schemas.interviewComplete), setInterviewResourceCompletion);

export default router;
