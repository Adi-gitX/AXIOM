import express from 'express';
import { fetchLiveJobs, fetchLivePosts } from '../services/publicIngest.js';

const router = express.Router();

/**
 * GET /api/public/jobs
 * Live remote-friendly jobs from RemoteOK + Arbeitnow (no auth needed upstream).
 * 30-min in-memory cache. Falls back to empty array if all upstreams down.
 */
router.get('/jobs', async (_req, res, next) => {
    try {
        const jobs = await fetchLiveJobs(30);
        res.json({ jobs: jobs || [], total: jobs?.length || 0, source: 'public' });
    } catch (err) { next(err); }
});

/**
 * GET /api/public/posts
 * Live developer feed from HackerNews top + Dev.to latest.
 * 30-min in-memory cache.
 */
router.get('/posts', async (_req, res, next) => {
    try {
        const posts = await fetchLivePosts(12);
        res.json({ posts: posts || [], total: posts?.length || 0, source: 'public' });
    } catch (err) { next(err); }
});

export default router;
