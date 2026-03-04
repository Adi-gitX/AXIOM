import express from 'express';
import {
    getAllJobs,
    getJobById,
    saveJob,
    unsaveJob,
    getSavedJobs,
    getSavedJobIds,
    applyToJob,
    getAppliedJobs
} from '../controllers/jobsController.js';
import { validate, schemas } from '../middleware/validation.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs with filters
router.get('/', getAllJobs);

// Get single job
router.get('/:id', getJobById);

// Save a job
router.post('/save', requireVerifiedUser, validate(schemas.jobSave), saveJob);

// Unsave a job
router.delete('/save/:jobId', requireVerifiedUser, validate(schemas.jobUnsave), unsaveJob);

// Get user's saved jobs
router.get('/saved/:email', requireVerifiedUser, getSavedJobs);

// Get saved job IDs only
router.get('/saved-ids/:email', requireVerifiedUser, getSavedJobIds);

// Track job application
router.post('/apply', requireVerifiedUser, validate(schemas.jobApply), applyToJob);

// Get applied jobs
router.get('/applied/:email', requireVerifiedUser, getAppliedJobs);

export default router;
