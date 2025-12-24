import React, { useState, useEffect, useRef } from 'react';
import { Hash, Search, Bell, Users, Plus, Mic, Headphones, Briefcase, Send, Smile } from 'lucide-react';
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
            <div className="w-56 bg-[#0f0f0f] rounded-2xl flex-col hidden md:flex overflow-hidden">
                <div className="p-4 border-b border-white/10">
                    <h2 className="font-bold text-white text-sm">AXIOM Community</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {CHANNELS.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                                ${activeChannel === channel.id
                                    ? 'bg-white/10 text-white font-medium'
                                    : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
                        >
                            <channel.icon size={16} />
                            <span className="truncate">{channel.name}</span>
                        </button>
                    ))}
                </div>

                <div className="p-3 border-t border-white/10 flex items-center gap-2.5">
                    <div className="relative">
                        <img src={user.avatar} className="w-8 h-8 rounded-full bg-white/10" alt="" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0f0f0f]"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-white/40">Online</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="h-14 border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
                    <div className="flex items-center gap-2">
                        <Hash size={18} className="text-gray-400" />
                        <span className="font-semibold text-gray-900">{CHANNELS.find(c => c.id === activeChannel)?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                        <Search size={18} className="cursor-pointer hover:text-gray-600" />
                        <Bell size={18} className="cursor-pointer hover:text-gray-600" />
                        <Users size={18} className="cursor-pointer hover:text-gray-600" />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <Briefcase size={40} className="mb-3 opacity-50" />
                            <p className="text-sm">No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex gap-2.5 ${msg.user === user.name.split(' ')[0] ? 'flex-row-reverse' : ''}`}
                        >
                            <img src={msg.avatar} alt="" className="w-8 h-8 rounded-full bg-gray-100 object-cover shrink-0" />
                            <div className={`flex flex-col max-w-[70%] ${msg.user === user.name.split(' ')[0] ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-medium text-xs text-gray-700">{msg.user}</span>
                                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                                </div>
                                <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${msg.user === user.name.split(' ')[0]
                                        ? 'bg-blue-600 text-white rounded-tr-sm'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-100 shrink-0">
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
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white p-2.5 rounded-lg transition-colors"
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
