import express from 'express';
import {
    getChannels,
    getMessages,
    sendMessage,
    deleteMessage,
    getNewMessages,
    createChannel
} from '../controllers/chatController.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Get all channels
router.get('/channels', getChannels);

// Create a new channel
router.post('/channels', validate(schemas.channelCreate), createChannel);

// Get messages for a channel
router.get('/messages/:channelId', getMessages);

// Get new messages (for polling)
router.get('/messages/:channelId/new', getNewMessages);

// Send a message
router.post('/messages', validate(schemas.chatMessage), sendMessage);

// Delete a message
router.delete('/messages/:id', validate(schemas.chatDeleteMessage), deleteMessage);

export default router;
