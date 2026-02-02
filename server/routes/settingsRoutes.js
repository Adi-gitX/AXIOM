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

const router = Router();

// Get user settings
router.get('/:email', getSettings);

// Update all settings
router.post('/', updateSettings);

// Update theme only
router.post('/theme', updateTheme);

// Update notification settings only
router.post('/notifications', updateNotifications);

export default router;
