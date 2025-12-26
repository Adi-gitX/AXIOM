import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getCloudinarySignature,
    initDb
} from '../controllers/userController.js';

const router = express.Router();

router.get('/sign-cloudinary', getCloudinarySignature);
router.get('/users/:email', getUserProfile);
router.post('/users/profile', updateUserProfile);
router.get('/init-db', initDb);

export default router;
