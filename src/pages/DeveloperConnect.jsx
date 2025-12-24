import React, { useState, useEffect, useRef } from 'react';
import { Hash, Search, Bell, Users, Briefcase, Send, Smile, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const CHANNELS = [
    { id: 'general', name: 'general-chat', icon: Hash },
    { id: 'react', name: 'react-devs', icon: Hash },
    { id: 'jobs', name: 'job-postings', icon: Briefcase },
    { id: 'help', name: 'coding-help', icon: Users },
];

const DeveloperConnect = () => {
    const [activeChannel, setActiveChannel] = useState('general');
    const [input, setInput] = useState('');
    const { channels, addMessage, user } = useStore();
    const messagesEndRef = useRef(null);

    const messages = channels[activeChannel] || [];

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => { scrollToBottom(); }, [messages, activeChannel]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newMessage = {
            id: Date.now(),
            user: user.name.split(' ')[0],
            avatar: user.avatar,
            content: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        addMessage(activeChannel, newMessage);
        setInput('');
    };

    return (
        <div className="h-[calc(100vh-2rem)] m-4 flex gap-4">

            {/* Channels Sidebar */}
            <div className="w-60 bg-white rounded-2xl border border-gray-100 flex-col hidden md:flex overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 text-sm">AXIOM Community</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Connect with developers</p>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {CHANNELS.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all
                                ${activeChannel === channel.id
                                    ? 'bg-gray-900 text-white font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <channel.icon size={16} />
                            <span className="truncate">{channel.name}</span>
                        </button>
                    ))}
                </div>

                <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center gap-2.5 px-2 py-2">
                        <div className="relative">
                            <img src={user.avatar} className="w-9 h-9 rounded-full bg-gray-100" alt="" />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-400">Online</p>
                        </div>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Settings size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
                    <div className="flex items-center gap-2">
                        <Hash size={18} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">{CHANNELS.find(c => c.id === activeChannel)?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Search size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Bell size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Users size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-stone-50">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                                <Hash size={28} className="text-gray-300" />
                            </div>
                            <p className="text-sm font-medium">No messages yet</p>
                            <p className="text-xs text-gray-400">Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex gap-3 ${msg.user === user.name.split(' ')[0] ? 'flex-row-reverse' : ''}`}
                        >
                            <img src={msg.avatar} alt="" className="w-9 h-9 rounded-full bg-gray-100 object-cover shrink-0" />
                            <div className={`flex flex-col max-w-[70%] ${msg.user === user.name.split(' ')[0] ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-xs text-gray-700">{msg.user}</span>
                                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                                </div>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.user === user.name.split(' ')[0]
                                        ? 'bg-gray-900 text-white rounded-tr-md'
                                        : 'bg-white text-gray-800 rounded-tl-md border border-gray-100'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 shrink-0 bg-white">
                    <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-50 rounded-xl p-1.5 border border-gray-200 focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-100 transition-all">
                        <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Smile size={18} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name}`}
                            className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none py-1.5"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white p-2.5 rounded-lg transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeveloperConnect;
