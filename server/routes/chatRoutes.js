import express from 'express';
import {
    getChannels,
    getOnlineUsers,
    getMessages,
    sendMessage,
    deleteMessage,
    getNewMessages,
    createChannel,
    getChannelMembers,
    inviteChannelMember,
    removeChannelMember,
} from '../controllers/chatController.js';
import { validate, schemas } from '../middleware/validation.js';
import { requireVerifiedUser } from '../middleware/auth.js';

const router = express.Router();
router.use(requireVerifiedUser);

// Get all channels
router.get('/channels', getChannels);

// Get online users
router.get('/online', getOnlineUsers);

// Create a new channel
router.post('/channels', validate(schemas.channelCreate), createChannel);

// Get messages for a channel
router.get('/messages/:channelId', getMessages);

// Get new messages (for polling)
router.get('/messages/:channelId/new', getNewMessages);

// Private room member management
router.get('/channels/:channelId/members', getChannelMembers);
router.post('/channels/:channelId/invite', validate(schemas.chatMemberInvite), inviteChannelMember);
router.post('/channels/:channelId/members/remove', validate(schemas.chatMemberRemove), removeChannelMember);

// Send a message
router.post('/messages', validate(schemas.chatMessage), sendMessage);

// Delete a message
router.delete('/messages/:id', validate(schemas.chatDeleteMessage), deleteMessage);

export default router;
