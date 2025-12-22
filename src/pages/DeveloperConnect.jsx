import React, { useState } from 'react';
import { Hash, Search, Bell, Users, MessageSquare, Plus, Mic, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const CHANNELS = [
    { id: 'general', name: 'general-chat', icon: Hash },
    { id: 'react', name: 'react-developers', icon: Hash },
    { id: 'jobs', name: 'job-postings', icon: BriefcaseIcon },
    { id: 'help', name: 'coding-help', icon: Users },
    { id: 'voice', name: 'Lounge (Voice)', icon: Mic },
];

function BriefcaseIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
}

const DeveloperConnect = () => {
    const [activeChannel, setActiveChannel] = useState('general');
    const [messages, setMessages] = useState([
        { id: 1, user: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', content: 'Anyone working on the new React implementation?', time: '10:30 AM' },
        { id: 2, user: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', content: 'Yes! I just pushed the initial commit.', time: '10:32 AM' },
        { id: 3, user: 'DevBot', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bot', content: 'Deployment successful to production.', time: '10:35 AM', isBot: true },
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            user: 'You',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
            content: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setInput('');
    };

    return (
        <div className="flex h-[calc(100vh-6rem)] animate-fade-in gap-4">

            {/* Channels Sidebar */}
            <div className="w-64 glass-panel flex flex-col overflow-hidden hidden md:flex">
                <div className="p-4 border-b border-border/50 font-bold text-text flex justify-between items-center">
                    <span>Dev Community</span>
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
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" className="w-8 h-8 rounded-full bg-surface" alt="User" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-text truncate">User Name</div>
                        <div className="text-[10px] text-textMuted">#1234</div>
                    </div>
                    <div className="flex gap-1 text-textMuted">
                        <Mic size={16} />
                        <Headphones size={16} />
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
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 group ${msg.user === 'You' ? 'flex-row-reverse' : ''}`}>
                            <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full bg-surface border border-border" />
                            <div className={`flex flex-col max-w-[70%] ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-text">{msg.user}</span>
                                    {msg.isBot && <span className="bg-primary text-[10px] px-1 rounded text-white font-bold">BOT</span>}
                                    <span className="text-[10px] text-textMuted">{msg.time}</span>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed
                                    ${msg.user === 'You'
                                        ? 'bg-primary text-white rounded-tr-sm'
                                        : 'bg-surfaceHighlight text-text rounded-tl-sm'}
                                `}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
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
                            className="w-full bg-surfaceHighlight/50 text-text placeholder:text-textMuted rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeveloperConnect;
