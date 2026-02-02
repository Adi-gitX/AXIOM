import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { chatApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/ui/GlassCard';

const CHANNELS = [
    { id: 'general', name: 'General', description: 'General discussion' },
    { id: 'react', name: 'React', description: 'React, hooks, components' },
    { id: 'jobs', name: 'Jobs', description: 'Opportunities & careers' },
    { id: 'help', name: 'Help', description: 'Get help with code' },
];

const DeveloperConnect = () => {
    const { currentUser } = useAuth();
    const [activeChannel, setActiveChannel] = useState('general');
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { channels: localChannels, addMessage: addLocalMessage } = useStore();
    const messagesEndRef = useRef(null);
    const pollIntervalRef = useRef(null);

    // Fetch messages from API
    const fetchMessages = async () => {
        try {
            const data = await chatApi.getMessages(activeChannel);
            if (data.messages && data.messages.length > 0) {
                setMessages(data.messages);
            } else {
                // Fall back to local messages if API returns empty
                setMessages(localChannels?.[activeChannel] || []);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
            // Fall back to local messages on error
            setMessages(localChannels?.[activeChannel] || []);
        } finally {
            setLoading(false);
        }
    };

    // Load messages when channel changes
    useEffect(() => {
        setLoading(true);
        fetchMessages();

        // Set up polling for new messages (every 5 seconds)
        pollIntervalRef.current = setInterval(fetchMessages, 5000);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, [activeChannel]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message
    const handleSend = async () => {
        if (!messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'You',
            avatar: currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email || 'You'}`,
            content: messageInput,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            email: currentUser?.email
        };

        // Optimistic update
        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');

        // Send to API
        try {
            await chatApi.sendMessage(
                currentUser?.email,
                activeChannel,
                messageInput,
                newMessage.user,
                newMessage.avatar
            );
        } catch (err) {
            console.error('Failed to send message:', err);
            // Keep the optimistic update, add to local store as backup
            addLocalMessage(activeChannel, newMessage);
        }
    };

    const getUserName = () => {
        if (currentUser?.displayName) return currentUser.displayName;
        if (currentUser?.email) return currentUser.email.split('@')[0];
        return 'You';
    };

    return (
        <div className="min-h-screen bg-transparent flex">

            {/* Sidebar */}
            <div className="w-60 border-r border-border p-6 shrink-0 hidden lg:block bg-card/50 backdrop-blur-xl">
                <h2 className="text-xs font-bold text-foreground uppercase tracking-widest mb-6 opacity-50">Channels</h2>
                <div className="space-y-1">
                    {CHANNELS.map((channel) => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${activeChannel === channel.id
                                ? 'glass-card border-border text-foreground shadow-glow'
                                : 'border-transparent text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <span className="text-muted-foreground opacity-50 font-mono">#</span>
                            <span className="text-sm font-medium">{channel.name}</span>
                        </button>
                    ))}
                </div>

                {/* Online Users */}
                <div className="mt-8">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4 opacity-50">Online</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 px-2">
                            <div className="relative">
                                <img
                                    src={currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.email}`}
                                    alt=""
                                    className="w-8 h-8 rounded-full bg-muted"
                                />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                            </div>
                            <span className="text-sm text-foreground">{getUserName()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen">

                {/* Header */}
                <header className="px-8 py-6 border-b border-border bg-card/30 backdrop-blur-md">
                    <h1 className="text-2xl font-light text-foreground font-display tracking-tight">
                        #{CHANNELS.find(c => c.id === activeChannel)?.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {CHANNELS.find(c => c.id === activeChannel)?.description}
                    </p>
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
                            <p className="text-foreground font-medium text-lg">Welcome to #{CHANNELS.find(c => c.id === activeChannel)?.name}</p>
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
                                                {msg.time || new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
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
                <div className="px-8 py-6 border-t border-border bg-card/20 backdrop-blur-xl">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-3 glass-panel px-2 py-2 rounded-2xl border-border">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name.toLowerCase()}`}
                                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none px-4 py-2"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!messageInput.trim()}
                                className="p-2.5 rounded-xl bg-foreground text-background hover:opacity-90 disabled:opacity-30 disabled:bg-muted disabled:text-muted-foreground transition-all shadow-glow"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DeveloperConnect;
