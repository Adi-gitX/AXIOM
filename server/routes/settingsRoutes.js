/**
 * Settings Routes
 * User preferences and settings management
 */

import { Router } from 'express';
import {
    getSettings,
    updateSettings,
    updateTheme,
    updateNotifications
} from '../controllers/settingsController.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = Router();
router.use(requireVerifiedUser);

// Get user settings
router.get('/:email', getSettings);

// Update all settings
router.post('/', updateSettings);

// Update theme only
router.post('/theme', updateTheme);

// Update notification settings only
router.post('/notifications', updateNotifications);

export default router;
