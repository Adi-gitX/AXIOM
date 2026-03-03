import express from 'express';
import {
    getUserProfile,
    getPublicProfile,
    updateUserProfile,
    updateUsername,
    getAtsScore,
    getCloudinarySignature,
    initDb,
    createOrGetUser
} from '../controllers/userController.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/sign-cloudinary', requireVerifiedUser, getCloudinarySignature);
router.get('/users/public/:username', getPublicProfile);
router.get('/users/ats/:email', requireVerifiedUser, getAtsScore);
router.get('/users/:email', requireVerifiedUser, getUserProfile);
router.post('/users/profile', requireVerifiedUser, updateUserProfile);
router.post('/users/username', requireVerifiedUser, updateUsername);
router.post('/users', requireVerifiedUser, createOrGetUser);
router.get('/init-db', initDb);

export default router;
