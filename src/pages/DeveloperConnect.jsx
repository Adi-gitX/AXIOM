import React, { useState, useEffect, useRef } from 'react';
import { Hash, Search, Bell, Users, Plus, Mic, Headphones, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';

const CHANNELS = [
    { id: 'general', name: 'general-chat', icon: Hash },
    { id: 'react', name: 'react-developers', icon: Hash },
    { id: 'jobs', name: 'job-postings', icon: Briefcase },
    { id: 'help', name: 'coding-help', icon: Users },
    { id: 'voice', name: 'Lounge (Voice)', icon: Mic },
];

const DeveloperConnect = () => {
    const [activeChannel, setActiveChannel] = useState('general');
    const [input, setInput] = useState('');
    const { channels, addMessage, user } = useStore();
    const messagesEndRef = useRef(null);

    const messages = channels[activeChannel] || [];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChannel]);

    const handleSend = (e) => {
        e.preventDefault();
        if(!input.trim()) return;
        
        const newMessage = {
            id: Date.now(),
            user: user.name.split(' ')[0], // First name
            avatar: user.avatar,
            content: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        addMessage(activeChannel, newMessage);
        setInput('');

        // Simulate Bot Response for demo
        if (Math.random() > 0.7) {
            setTimeout(() => {
                 addMessage(activeChannel, {
                    id: Date.now() + 1,
                    user: 'AxiomBot',
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Axiom',
                    content: 'That is an interesting point! Keep building.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isBot: true
                });
            }, 1000);
        }
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] animate-fade-in gap-4">
            
            {/* Channels Sidebar */}
            <div className="w-64 glass-panel flex flex-col overflow-hidden hidden md:flex">
                <div className="p-4 border-b border-border/50 font-bold text-text flex justify-between items-center">
                    <span>AXIOM Community</span>
                    <Plus size={18} className="cursor-pointer hover:text-primary" />
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {CHANNELS.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium
                                ${activeChannel === channel.id 
                                ? 'bg-primary/20 text-primary' 
                                : 'text-textMuted hover:bg-surfaceHighlight hover:text-text'}
                            `}
                        >
                            <channel.icon size={18} />
                            <span className="truncate">{channel.name}</span>
                        </button>
                    ))}
                </div>

                {/* Voice Status Mock */}
                <div className="p-3 bg-surfaceHighlight/30 border-t border-border/50 flex items-center gap-3">
                    <div className="relative">
                        <img src={user.avatar} className="w-8 h-8 rounded-full bg-surface" alt="User" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-text truncate">{user.name}</div>
                        <div className="text-[10px] text-textMuted">Online</div>
                    </div>
                    <div className="flex gap-1 text-textMuted">
                        <Mic size={16} className="hover:text-text cursor-pointer" />
                        <Headphones size={16} className="hover:text-text cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-panel flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-surface/30">
                    <div className="flex items-center gap-2">
                        <Hash size={20} className="text-textMuted" />
                        <span className="font-bold text-text">{CHANNELS.find(c => c.id === activeChannel)?.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-textMuted">
                        <Search size={20} className="cursor-pointer hover:text-text" />
                        <Bell size={20} className="cursor-pointer hover:text-text" />
                        <Users size={20} className="cursor-pointer hover:text-text" />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-textMuted opacity-50">
                            <MessageSquare size={48} className="mb-2" />
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 group ${msg.user === user.name.split(' ')[0] ? 'flex-row-reverse' : ''}`}>
                             <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full bg-surface border border-border object-cover" />
                             <div className={`flex flex-col max-w-[70%] ${msg.user === user.name.split(' ')[0] ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-text">{msg.user}</span>
                                    {msg.isBot && <span className="bg-primary text-[10px] px-1 rounded text-white font-bold">BOT</span>}
                                    <span className="text-[10px] text-textMuted">{msg.time}</span>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed
                                    ${msg.user === user.name.split(' ')[0] 
                                    ? 'bg-primary text-white rounded-tr-sm' 
                                    : 'bg-surfaceHighlight text-text rounded-tl-sm'}
                                `}>
                                    {msg.content}
                                </div>
                             </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-surface/30">
                    <form onSubmit={handleSend} className="relative">
                        <div className="absolute left-3 top-3 text-textMuted hover:text-text cursor-pointer">
                            <Plus size={20} />
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name}`}
                            className="w-full bg-surfaceHighlight/50 text-text placeholder:text-textMuted rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeveloperConnect;
