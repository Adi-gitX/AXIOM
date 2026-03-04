import express from 'express';
import {
    getGithubConnectUrl,
    githubOAuthCallback,
    disconnectGithub,
    syncGithubContributions,
    getSyncStatus,
    getMyContributions,
    getOssActivity,
    getIssueRecommendation,
    getConnectedGithubProfile,
} from '../controllers/ossController.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/github/connect-url', requireVerifiedUser, getGithubConnectUrl);
router.get('/github/callback', githubOAuthCallback);
router.get('/github/profile/:email', requireVerifiedUser, getConnectedGithubProfile);
router.get('/sync-status/:email', requireVerifiedUser, getSyncStatus);

router.post('/github/disconnect', requireVerifiedUser, disconnectGithub);
router.post('/sync/:email', requireVerifiedUser, syncGithubContributions);

router.get('/contributions/:email', requireVerifiedUser, getMyContributions);
router.get('/activity/:email', requireVerifiedUser, getOssActivity);
router.get('/issue/:email', requireVerifiedUser, getIssueRecommendation);

export default router;
