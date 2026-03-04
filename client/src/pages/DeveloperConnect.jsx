import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useUserStore } from '../stores/useUserStore';

const DeveloperConnect = () => {
    const { currentUser } = useAuth();
    const { user: profileData, fetchProfile } = useUserStore();
    const [channels, setChannels] = useState([]);
    const [activeChannel, setActiveChannel] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [channelsLoading, setChannelsLoading] = useState(true);
    const [error, setError] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [newChannel, setNewChannel] = useState({ name: '', description: '', isPrivate: false });
    const [createLoading, setCreateLoading] = useState(false);
    const [channelMembers, setChannelMembers] = useState([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [memberActionLoading, setMemberActionLoading] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [memberError, setMemberError] = useState('');
    const [pollBlockedUntil, setPollBlockedUntil] = useState(0);
    const messagesEndRef = useRef(null);
    const pollIntervalRef = useRef(null);
    const onlinePollRef = useRef(null);

    const isTransientApiError = (err) => (
        err?.status === 401
        || err?.status === 429
        || err?.status === 503
        || err?.code === 'BACKEND_UNAVAILABLE'
    );

    // Fetch channels from API
    useEffect(() => {
        if (currentUser?.email) {
            fetchProfile(currentUser.email);
        }
    }, [currentUser?.email, fetchProfile]);

    useEffect(() => {
        const fetchChannels = async () => {
            setChannelsLoading(true);
            setError('');
            try {
                const data = await chatApi.getChannels(currentUser?.email || '');
                if (data.channels && data.channels.length > 0) {
                    setChannels(data.channels);
                    setActiveChannel((prev) => prev || data.channels[0].id);
                } else {
                    setChannels([]);
                }
            } catch (err) {
                if (!isTransientApiError(err)) {
                    console.error('Failed to fetch channels:', err);
                }
                if (err?.status === 429) {
                    setPollBlockedUntil(Date.now() + 10_000);
                }
                setError('Failed to load channels');
            } finally {
                setChannelsLoading(false);
            }
        };
        fetchChannels();
    }, [currentUser?.email]);

    // Fetch messages from API
    const fetchMessages = useCallback(async () => {
        if (Date.now() < pollBlockedUntil) {
            return;
        }
        if (!activeChannel) {
            setMessages([]);
            setLoading(false);
            return;
        }

        try {
            const data = await chatApi.getMessages(activeChannel, 50, currentUser?.email || '');
            // Handle the wrapped response format
            const messageList = data.messages || data || [];
            setMessages(Array.isArray(messageList) ? messageList : []);
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to fetch messages:', err);
            }
            if (err?.status === 429) {
                setPollBlockedUntil(Date.now() + 10_000);
            }
            setError('Failed to load messages');
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, [activeChannel, currentUser?.email, pollBlockedUntil]);

    const fetchOnlineUsers = useCallback(async () => {
        if (Date.now() < pollBlockedUntil) {
            return;
        }
        try {
            const data = await chatApi.getOnlineUsers();
            const users = Array.isArray(data?.users) ? data.users : [];
            setOnlineUsers(users);
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to fetch online users:', err);
            }
            if (err?.status === 429) {
                setPollBlockedUntil(Date.now() + 10_000);
            }
            setOnlineUsers([]);
        }
    }, [pollBlockedUntil]);

    const fetchChannelMembers = useCallback(async (channelId) => {
        if (!channelId) {
            setChannelMembers([]);
            setMemberError('');
            return;
        }

        const selected = channels.find((channel) => channel.id === channelId);
        if (!selected?.is_private) {
            setChannelMembers([]);
            setMemberError('');
            return;
        }

        setMembersLoading(true);
        setMemberError('');
        try {
            const response = await chatApi.getChannelMembers(channelId);
            setChannelMembers(Array.isArray(response?.members) ? response.members : []);
        } catch (err) {
            if (!isTransientApiError(err)) {
                console.error('Failed to load private room members:', err);
            }
            if (err?.status === 429) {
                setPollBlockedUntil(Date.now() + 10_000);
            }
            setMemberError(err.message || 'Failed to load private room members');
            setChannelMembers([]);
        } finally {
            setMembersLoading(false);
        }
    }, [channels]);

    // Load messages when channel changes
    useEffect(() => {
        setLoading(true);
        fetchMessages();
        fetchOnlineUsers();

        // Set up polling for new messages (every 5 seconds)
        pollIntervalRef.current = setInterval(fetchMessages, 5000);
        onlinePollRef.current = setInterval(fetchOnlineUsers, 15000);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
            if (onlinePollRef.current) {
                clearInterval(onlinePollRef.current);
            }
        };
    }, [activeChannel, currentUser?.email, fetchMessages, fetchOnlineUsers]);

    useEffect(() => {
        fetchChannelMembers(activeChannel);
    }, [activeChannel, fetchChannelMembers]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message
    const handleSend = async () => {
        if (!messageInput.trim() || !activeChannel || !currentUser?.email) return;

        const newMessage = {
            id: Date.now(),
            user: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'You',
            avatar: currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email || 'You'}`,
            content: messageInput,
            time: new Date().toISOString(),
            email: currentUser?.email
        };

        // Optimistic update
        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');

        // Send to API
        try {
            await chatApi.sendMessage(
                currentUser.email,
                activeChannel,
                messageInput,
                newMessage.user,
                newMessage.avatar
            );
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message');
        }
    };

    // Create new channel
    const handleCreateChannel = async (e) => {
        e.preventDefault();
        if (!newChannel.name.trim()) return;

        setCreateLoading(true);
        try {
            const data = await chatApi.createChannel(
                newChannel.name.trim(),
                newChannel.description.trim(),
                currentUser?.email,
                Boolean(newChannel.isPrivate)
            );

            if (data.channel) {
                setChannels(prev => [...prev, data.channel]);
                setActiveChannel(data.channel.id);
            }

            setNewChannel({ name: '', description: '', isPrivate: false });
            setShowCreateChannel(false);
        } catch (err) {
            console.error('Failed to create channel:', err);
            alert(err.message || 'Failed to create channel');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleInviteMember = async (event) => {
        event.preventDefault();
        const normalized = inviteEmail.trim().toLowerCase();
        if (!normalized || !activeChannel) return;

        setMemberActionLoading(true);
        setMemberError('');
        try {
            await chatApi.inviteChannelMember(activeChannel, normalized);
            setInviteEmail('');
            await fetchChannelMembers(activeChannel);
        } catch (err) {
            console.error('Failed to invite member:', err);
            setMemberError(err.message || 'Failed to invite member');
        } finally {
            setMemberActionLoading(false);
        }
    };

    const handleRemoveMember = async (memberEmail) => {
        if (!memberEmail || !activeChannel) return;
        setMemberActionLoading(true);
        setMemberError('');
        try {
            await chatApi.removeChannelMember(activeChannel, memberEmail);
            await fetchChannelMembers(activeChannel);
        } catch (err) {
            console.error('Failed to remove member:', err);
            setMemberError(err.message || 'Failed to remove member');
        } finally {
            setMemberActionLoading(false);
        }
    };

    const getUserName = () => {
        if (currentUser?.displayName) return currentUser.displayName;
        if (currentUser?.email) return currentUser.email.split('@')[0];
        return 'You';
    };

    const formatTime = (time) => {
        if (!time) return '';
        const date = new Date(time);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const activeChannelData = channels.find(c => c.id === activeChannel) || { name: activeChannel, description: '' };
    const privateRooms = channels.filter((channel) => channel.is_private);
    const ownedPrivateRooms = privateRooms.filter((channel) => channel.can_manage_members);
    const joinedPrivateRooms = privateRooms.filter((channel) => !channel.can_manage_members);
    const isPrivateChannel = Boolean(activeChannelData?.is_private);
    const canManageMembers = Boolean(activeChannelData?.can_manage_members);
    const currentUserEntry = {
        email: currentUser?.email || '',
        name: getUserName(),
        avatar: currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email || 'You'}`,
    };
    const combinedOnlineUsers = (() => {
        const map = new Map();
        for (const user of onlineUsers) {
            if (!user?.email) continue;
            map.set(user.email, user);
        }
        if (currentUserEntry.email) {
            map.set(currentUserEntry.email, currentUserEntry);
        }
        return Array.from(map.values());
    })();

    return (
        <div className="min-h-screen bg-transparent flex">

            {/* Sidebar */}
            <div className="w-60 border-r border-border p-6 shrink-0 hidden lg:block bg-background/40">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-widest opacity-50">Channels</h2>
                    <button
                        onClick={() => setShowCreateChannel(true)}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Create Channel"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-1">
                    {channelsLoading && (
                        <div className="px-4 py-3 text-xs text-muted-foreground">Loading channels...</div>
                    )}
                    {channels.map((channel) => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${activeChannel === channel.id
                                ? 'bg-background/80 border-border text-foreground shadow-sm'
                                : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <span className="text-muted-foreground opacity-50 font-mono">#</span>
                            <span className="text-sm font-medium truncate">{channel.name}</span>
                            {channel.is_private && (
                                <span className="ml-auto text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                                    {channel.can_manage_members ? 'Owner' : 'Private'}
                                </span>
                            )}
                        </button>
                    ))}
                    {!channelsLoading && channels.length === 0 && (
                        <div className="px-4 py-3 text-xs text-muted-foreground">
                            No channels available
                        </div>
                    )}
                </div>

                {privateRooms.length > 0 && (
                    <div className="mt-5 space-y-2">
                        <div className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                            My Private Rooms
                        </div>
                        <div className="px-2 text-xs text-muted-foreground">
                            {ownedPrivateRooms.length} owned • {joinedPrivateRooms.length} joined
                        </div>
                    </div>
                )}

                {/* Online Users */}
                <div className="mt-8">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4 opacity-50">Online</h3>
                    <div className="space-y-2">
                        {combinedOnlineUsers.length === 0 ? (
                            <p className="text-xs text-muted-foreground px-2">No users active in the last 30 mins</p>
                        ) : (
                            combinedOnlineUsers.map((user) => (
                                <div key={user.email} className="flex items-center gap-2 px-2">
                                    <div className="relative">
                                        <img
                                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name}`}
                                            alt=""
                                            className="w-8 h-8 rounded-full bg-muted"
                                        />
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                                    </div>
                                    <span className="text-sm text-foreground truncate">{user.name || user.email}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen">

                {/* Header */}
                <header className="px-8 py-6 border-b border-border bg-background/40">
                    <h1 className="text-2xl font-semibold text-foreground font-display tracking-tight">
                        #{activeChannelData.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {activeChannelData.description}
                    </p>
                    {error && (
                        <p className="text-xs text-rose-400 mt-2">{error}</p>
                    )}
                    {isPrivateChannel && (
                        <div className="mt-4 rounded-2xl border border-border bg-background/40 px-4 py-3 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Private Room Members</p>
                                    <p className="text-sm text-foreground">
                                        {membersLoading ? 'Loading members...' : `${channelMembers.length} member${channelMembers.length === 1 ? '' : 's'}`}
                                    </p>
                                </div>
                                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-border text-muted-foreground">
                                    {canManageMembers ? 'Owner Controls' : 'Member Access'}
                                </span>
                            </div>

                            {memberError && (
                                <p className="text-xs text-rose-400">{memberError}</p>
                            )}

                            {!membersLoading && (
                                <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                    {channelMembers.length === 0 ? (
                                        <p className="text-xs text-muted-foreground">No members added yet.</p>
                                    ) : (
                                        channelMembers.map((member) => (
                                            <div
                                                key={`${member.email}-${member.role}`}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-sm text-foreground truncate">{member.email}</p>
                                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{member.role}</p>
                                                </div>
                                                {canManageMembers && member.role !== 'owner' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMember(member.email)}
                                                        className="text-xs text-rose-400 hover:text-rose-300"
                                                        disabled={memberActionLoading}
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {canManageMembers && (
                                <form onSubmit={handleInviteMember} className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(event) => setInviteEmail(event.target.value)}
                                        placeholder="Invite member by email"
                                        className="flex-1 rounded-xl border border-border bg-background/70 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                                    />
                                    <button
                                        type="submit"
                                        disabled={memberActionLoading || !inviteEmail.trim()}
                                        className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-semibold disabled:opacity-50"
                                    >
                                        {memberActionLoading ? 'Updating...' : 'Invite'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground">Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mb-6">
                                <span className="text-3xl text-muted-foreground font-light">#</span>
                            </div>
                            <p className="text-foreground font-medium text-lg">Welcome to #{activeChannelData.name}</p>
                            <p className="text-sm text-muted-foreground mt-2">Start the conversation</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-4 group"
                                >
                                    <img
                                        src={msg.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`}
                                        alt=""
                                        className="w-10 h-10 rounded-xl bg-card border border-border shrink-0"
                                    />
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-foreground text-sm">{msg.user || msg.username}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatTime(msg.time || msg.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-foreground/90 mt-1 leading-relaxed">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="px-8 py-6 border-t border-border bg-background/40">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 bg-background border border-border px-2 py-2 rounded-2xl shadow-sm">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={activeChannelData.name ? `Message #${activeChannelData.name.toLowerCase()}` : 'Select a channel'}
                                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none px-4 py-2"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!messageInput.trim() || !activeChannel || !currentUser?.email}
                                className="p-2.5 rounded-xl bg-foreground text-background hover:opacity-90 disabled:opacity-30 disabled:bg-muted disabled:text-muted-foreground transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Create Channel Modal */}
            <AnimatePresence>
                {showCreateChannel && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCreateChannel(false)}
                    >
                        <motion.div
                            className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-foreground">Create Channel</h2>
                                <button
                                    onClick={() => setShowCreateChannel(false)}
                                    className="p-2 rounded-xl hover:bg-muted transition-colors"
                                >
                                    <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleCreateChannel} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Channel Name *</label>
                                    <input
                                        type="text"
                                        value={newChannel.name}
                                        onChange={e => setNewChannel(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="e.g. Python, DevOps, Frontend"
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                                        required
                                        maxLength={100}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                                    <input
                                        type="text"
                                        value={newChannel.description}
                                        onChange={e => setNewChannel(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="What's this channel about?"
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                                        maxLength={500}
                                    />
                                </div>

                                <label className="flex items-start gap-3 p-3 rounded-xl border border-border bg-background/40">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(newChannel.isPrivate)}
                                        onChange={(event) => setNewChannel((prev) => ({ ...prev, isPrivate: event.target.checked }))}
                                        disabled={!profileData?.is_pro}
                                        className="mt-0.5"
                                    />
                                    <span className="text-sm text-foreground">
                                        Private room (Pro)
                                        <span className="block text-xs text-muted-foreground mt-0.5">
                                            Invite-only collaboration room. {profileData?.is_pro ? 'Enabled for your plan.' : 'Upgrade to Pro to enable private rooms.'}
                                        </span>
                                    </span>
                                </label>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateChannel(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading || !newChannel.name.trim()}
                                        className="flex-1 px-4 py-3 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {createLoading ? 'Creating...' : 'Create Channel'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeveloperConnect;
