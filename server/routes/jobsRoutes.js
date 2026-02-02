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

const router = express.Router();

// Get all jobs with filters
router.get('/', getAllJobs);

// Get single job
router.get('/:id', getJobById);

// Save a job
router.post('/save', validate(schemas.jobSave), saveJob);

// Unsave a job
router.delete('/save/:jobId', unsaveJob);

// Get user's saved jobs
router.get('/saved/:email', getSavedJobs);

// Get saved job IDs only
router.get('/saved-ids/:email', getSavedJobIds);

// Track job application
router.post('/apply', applyToJob);

// Get applied jobs
router.get('/applied/:email', getAppliedJobs);

export default router;
