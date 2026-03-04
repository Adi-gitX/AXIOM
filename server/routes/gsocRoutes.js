import express from 'express';
import {
    getGsocTimeline,
    getGsocOrgs,
    getGsocReadiness,
    getReminderState,
    dismissReminder,
    restoreReminder,
} from '../controllers/gsocController.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/timeline', getGsocTimeline);
router.get('/orgs', getGsocOrgs);
router.get('/readiness/:email', requireVerifiedUser, getGsocReadiness);
router.get('/reminders/:email', requireVerifiedUser, getReminderState);
router.post('/reminders/dismiss', requireVerifiedUser, dismissReminder);
router.post('/reminders/restore', requireVerifiedUser, restoreReminder);

export default router;
