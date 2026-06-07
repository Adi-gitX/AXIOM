import express from 'express';
import { createSubmission, listSubmissions, submissionSummary } from '../controllers/submissionsController.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

router.use(requireVerifiedUser);

router.post('/', createSubmission);
router.get('/:email/:problemId', listSubmissions);
router.get('/:email', submissionSummary);

export default router;
