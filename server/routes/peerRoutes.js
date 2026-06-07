import express from 'express';
import {
    createRoom, listOpenRooms, getRoom, joinRoom, quickMatch, endRoom, submitFeedback, getLeaderboard, getMyStats,
} from '../controllers/peerController.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

router.use(requireVerifiedUser);

router.post('/rooms', createRoom);
router.get('/rooms', listOpenRooms);
router.post('/quick-match', quickMatch);
router.post('/feedback', submitFeedback);
router.get('/leaderboard', getLeaderboard);
router.get('/rooms/:roomId', getRoom);
router.post('/rooms/:roomId/join', joinRoom);
router.post('/rooms/:roomId/end', endRoom);
router.get('/stats/:email', getMyStats);

export default router;
