import React, { useState, useEffect, useRef } from 'react';
import { Hash, Search, Bell, Users, Plus, Mic, Headphones, Briefcase, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import GlassCard from '../components/ui/GlassCard';

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
            user: user.name.split(' ')[0],
            avatar: user.avatar,
            content: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        addMessage(activeChannel, newMessage);
        setInput('');

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
        <div className="flex h-[calc(100vh-6rem)] animate-fade-in gap-6 pb-6">
            
            {/* Channels Sidebar */}
            <GlassCard className="w-72 flex flex-col overflow-hidden hidden md:flex p-0 border-r border-white/10">
                <div className="p-6 border-b border-white/10 font-bold text-white flex justify-between items-center text-lg">
                    <span>AXIOM Community</span>
                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                        <Plus size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {CHANNELS.map(channel => (
                        <button
                            key={channel.id}
                            onClick={() => setActiveChannel(channel.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                                ${activeChannel === channel.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                : 'text-white/60 hover:bg-white/5 hover:text-white'}
                            `}
                        >
                            <channel.icon size={18} />
                            <span className="truncate">{channel.name}</span>
                        </button>
                    ))}
                </div>

                {/* Voice Status Mock */}
                <div className="p-4 bg-black/20 border-t border-white/5 flex items-center gap-3">
                    <div className="relative">
                        <img src={user.avatar} className="w-10 h-10 rounded-full bg-white/5" alt="User" />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{user.name}</div>
                        <div className="text-xs text-white/50">Online</div>
                    </div>
                    <div className="flex gap-2 text-white/40">
                        <Mic size={18} className="hover:text-white cursor-pointer transition-colors" />
                        <Headphones size={18} className="hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>
            </GlassCard>

            {/* Chat Area */}
            <GlassCard className="flex-1 flex flex-col overflow-hidden p-0 relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 to-transparent pointer-events-none" />
                
                {/* Chat Header */}
                <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <Hash size={24} className="text-white/40" />
                        <span className="font-bold text-xl text-white">{CHANNELS.find(c => c.id === activeChannel)?.name}</span>
                    </div>
                    <div className="flex items-center gap-5 text-white/50">
                        <Search size={20} className="cursor-pointer hover:text-white transition-colors" />
                        <Bell size={20} className="cursor-pointer hover:text-white transition-colors" />
                        <Users size={20} className="cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-0">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-white/30">
                            <Briefcase size={64} className="mb-4 opacity-50" />
                            <p className="text-lg">No messages yet. Start the conversation!</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id} 
                            className={`flex gap-4 group ${msg.user === user.name.split(' ')[0] ? 'flex-row-reverse' : ''}`}
                        >
                             <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-xl bg-white/10 object-cover shadow-sm" />
                             <div className={`flex flex-col max-w-[70%] ${msg.user === user.name.split(' ')[0] ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-white">{msg.user}</span>
                                    {msg.isBot && <span className="bg-blue-500 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">BOT</span>}
                                    <span className="text-[10px] text-white/30">{msg.time}</span>
                                </div>
                                <div className={`px-5 py-3 rounded-2xl text-base leading-relaxed shadow-sm
                                    ${msg.user === user.name.split(' ')[0] 
                                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                                    : 'bg-white/10 text-white/90 rounded-tl-sm backdrop-blur-sm border border-white/5'}
                                `}>
                                    {msg.content}
                                </div>
                             </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white/5 border-t border-white/10 z-10">
                    <form onSubmit={handleSend} className="relative flex gap-4">
                        <div className="relative flex-1">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer transition-colors">
                                <Plus size={22} />
                            </div>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Message #${CHANNELS.find(c => c.id === activeChannel)?.name}`}
                                className="w-full bg-black/20 text-white placeholder:text-white/30 rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium border border-white/5"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={!input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-2xl transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </GlassCard>
        </div>
    );
};

export default DeveloperConnect;
