import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const CHANNELS = [
    { id: 'general', name: 'General', description: 'General discussion' },
    { id: 'react', name: 'React', description: 'React, hooks, components' },
    { id: 'jobs', name: 'Jobs', description: 'Opportunities & careers' },
    { id: 'help', name: 'Help', description: 'Get help with code' },
];

const DeveloperConnect = () => {
    const [activeChannel, setActiveChannel] = useState('general');
    const [messageInput, setMessageInput] = useState('');
    const { channels, addMessage } = useStore();
    const messagesEndRef = useRef(null);

    // Use channels from store, default to empty array
    const channelMessages = channels?.[activeChannel] || [];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [channelMessages]);

    const handleSend = () => {
        if (!messageInput.trim()) return;
        addMessage(activeChannel, {
            id: Date.now(),
            user: 'You',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
            content: messageInput,
            time: 'now',
        });
        setMessageInput('');
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
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen">

                {/* Header */}
                <header className="px-8 py-6 border-b border-border bg-card/30 backdrop-blur-md">
                    <h1 className="text-2xl font-light text-foreground text-glow font-display">
                        #{CHANNELS.find(c => c.id === activeChannel)?.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {CHANNELS.find(c => c.id === activeChannel)?.description}
                    </p>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    {channelMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mb-6">
                                <span className="text-3xl text-muted-foreground font-light">#</span>
                            </div>
                            <p className="text-foreground font-medium text-lg">Welcome to #{CHANNELS.find(c => c.id === activeChannel)?.name}</p>
                            <p className="text-sm text-muted-foreground mt-2">Start the conversation</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {channelMessages.map((msg) => (
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
                                            <span className="font-bold text-foreground text-sm">{msg.user}</span>
                                            <span className="text-xs text-muted-foreground">{msg.time}</span>
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
