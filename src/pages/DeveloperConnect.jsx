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
        <div className="min-h-screen bg-white flex">

            {/* Sidebar */}
            <div className="w-60 border-r border-gray-100 p-6 shrink-0 hidden lg:block">
                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-5">Channels</h2>
                <div className="space-y-1">
                    {CHANNELS.map((channel) => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all ${activeChannel === channel.id
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-gray-400">#</span>
                            <span className="text-sm">{channel.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col min-h-screen">

                {/* Header */}
                <header className="px-8 py-6 border-b border-gray-100">
                    <h1 className="text-2xl font-light text-gray-900">
                        #{CHANNELS.find(c => c.id === activeChannel)?.name}
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {CHANNELS.find(c => c.id === activeChannel)?.description}
                    </p>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {channelMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                <span className="text-2xl text-gray-300">#</span>
                            </div>
                            <p className="text-gray-500 font-medium">Welcome to #{CHANNELS.find(c => c.id === activeChannel)?.name}</p>
                            <p className="text-sm text-gray-400 mt-1">Start the conversation</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-3xl">
                            {channelMessages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-4"
                                >
                                    <img
                                        src={msg.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`}
                                        alt=""
                                        className="w-10 h-10 rounded-full bg-gray-100 shrink-0"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{msg.user}</span>
                                            <span className="text-xs text-gray-400">{msg.time}</span>
                                        </div>
                                        <p className="text-gray-700 mt-1">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="px-8 py-5 border-t border-gray-100">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name.toLowerCase()}`}
                                className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!messageInput.trim()}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
