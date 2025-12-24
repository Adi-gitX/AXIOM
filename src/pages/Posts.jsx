import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

// Posts data (Keep existing data)
const POSTS = [
    {
        id: 1,
        source: { name: "Y Combinator", icon: "Y", color: "#FF6600" },
        title: "coder/ghostty-web: Ghostty for the web with xterm.js API compatibility",
        content: "Ghostty is a fast, feature-rich, and cross-platform terminal emulator. This project brings Ghostty to the web with xterm.js API compatibility, allowing you to embed terminal experiences in web applications.",
        tags: ["typescript"],
        date: "Dec 02",
        readTime: "2m read time",
        author: { name: "Mitchell Hashimoto", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mitchell", handle: "@mitchellh", reputation: "45.2K" },
        preview: {
            repo: "coder/ghostty-web",
            description: "Ghostty for the web with xterm.js API compatibility",
            icon: "https://avatars.githubusercontent.com/u/95932066?s=48&v=4",
            contributors: 4,
            issues: 0,
            stars: 209,
            forks: 9
        },
        upvotes: 59,
        comments: 1,
        saved: false
    },
    {
        id: 2,
        source: { name: "Dev.to", icon: "D", color: "#0A0A0A" },
        title: "Building Scalable React Applications with Modern Architecture Patterns",
        content: "Learn how to build enterprise-grade React applications using modern patterns like compound components, render props, and hooks. This guide covers everything from project structure to state management.",
        tags: ["react", "architecture"],
        date: "Dec 24",
        readTime: "5m read time",
        author: { name: "Dan Abramov", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Dan", handle: "@dan_abramov", reputation: "89.1K" },
        preview: {
            repo: "facebook/react",
            description: "A declarative, efficient, and flexible JavaScript library",
            icon: "https://avatars.githubusercontent.com/u/69631?s=48&v=4",
            contributors: 1600,
            issues: 850,
            stars: 218000,
            forks: 46000
        },
        upvotes: 284,
        comments: 42,
        saved: true
    },
    {
        id: 3,
        source: { name: "Hacker News", icon: "H", color: "#FF6600" },
        title: "The Future of CSS: Container Queries, Cascade Layers, and Beyond",
        content: "CSS is evolving rapidly with new features like container queries, cascade layers, and native nesting. This article explores what's coming and how to prepare your codebase for the future.",
        tags: ["css", "frontend"],
        date: "Dec 23",
        readTime: "4m read time",
        author: { name: "Lea Verou", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Lea", handle: "@leaverou", reputation: "62.3K" },
        preview: {
            repo: "w3c/csswg-drafts",
            description: "CSS Working Group Editor Drafts",
            icon: "https://avatars.githubusercontent.com/u/379216?s=48&v=4",
            contributors: 89,
            issues: 2100,
            stars: 4200,
            forks: 650
        },
        upvotes: 156,
        comments: 28,
        saved: false
    },
    {
        id: 4,
        source: { name: "Medium", icon: "M", color: "#000000" },
        title: "System Design Interview: Building a Real-time Notification System",
        content: "Master system design interviews by learning how to design a scalable real-time notification system. Covers WebSockets, Redis pub/sub, message queues, and more.",
        tags: ["system-design", "backend"],
        date: "Dec 22",
        readTime: "8m read time",
        author: { name: "Alex Xu", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Alex", handle: "@alexxubyte", reputation: "120K" },
        preview: {
            repo: "donnemartin/system-design-primer",
            description: "Learn how to design large-scale systems",
            icon: "https://avatars.githubusercontent.com/u/4040840?s=48&v=4",
            contributors: 120,
            issues: 210,
            stars: 245000,
            forks: 42000
        },
        upvotes: 421,
        comments: 67,
        saved: false
    },
    {
        id: 5,
        source: { name: "Reddit", icon: "R", color: "#FF4500" },
        title: "TypeScript 5.4: Everything New You Need to Know About",
        content: "TypeScript 5.4 introduces improved type inference, new utility types, and better error messages. This comprehensive guide covers all the new features you should know.",
        tags: ["typescript", "javascript"],
        date: "Dec 21",
        readTime: "6m read time",
        author: { name: "Matt Pocock", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Matt", handle: "@mattpocockuk", reputation: "78.5K" },
        preview: {
            repo: "microsoft/TypeScript",
            description: "TypeScript is a superset of JavaScript",
            icon: "https://avatars.githubusercontent.com/u/6154722?s=48&v=4",
            contributors: 800,
            issues: 5400,
            stars: 97000,
            forks: 12000
        },
        upvotes: 198,
        comments: 35,
        saved: true
    },
    {
        id: 6,
        source: { name: "GitHub", icon: "G", color: "#24292F" },
        title: "Building AI-Powered Features with OpenAI GPT-4 API Integration",
        content: "A practical guide to integrating OpenAI's GPT-4 API into your applications. Learn how to build intelligent features like content generation, summarization, and chatbots.",
        tags: ["ai", "openai", "api"],
        date: "Dec 20",
        readTime: "10m read time",
        author: { name: "Harrison Chase", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Harrison", handle: "@hwchase17", reputation: "56.2K" },
        preview: {
            repo: "openai/openai-node",
            description: "Node.js library for the OpenAI API",
            icon: "https://avatars.githubusercontent.com/u/14957082?s=48&v=4",
            contributors: 45,
            issues: 89,
            stars: 5600,
            forks: 780
        },
        upvotes: 567,
        comments: 89,
        saved: false
    }
];

const MOCK_COMMENTS = [
    { id: 1, author: { name: "OrcDev", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Orc", reputation: "47.4K" }, content: "Awesome library! The component quality is top-notch.", time: "3w", upvotes: 24 },
    { id: 2, author: { name: "Peter Cruckshank", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Peter", reputation: "8.8K" }, content: "Looks like a polished UX. Would love more animation options.", time: "3w", upvotes: 18 },
];

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    return num.toString();
};

// Post Card
const PostCard = ({ post, index, onClick }) => {
    const [upvotes, setUpvotes] = useState(post.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);
    const [isSaved, setIsSaved] = useState(post.saved);

    const handleUpvote = (e) => {
        e.stopPropagation();
        if (hasUpvoted) {
            setUpvotes(prev => prev - 1);
            setHasUpvoted(false);
        } else {
            setUpvotes(prev => prev + (hasDownvoted ? 2 : 1));
            setHasUpvoted(true);
            setHasDownvoted(false);
        }
    };

    const handleDownvote = (e) => {
        e.stopPropagation();
        if (hasDownvoted) {
            setUpvotes(prev => prev + 1);
            setHasDownvoted(false);
        } else {
            setUpvotes(prev => prev - (hasUpvoted ? 2 : 1));
            setHasDownvoted(true);
            setHasUpvoted(false);
        }
    };

    return (
        <GlassCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onClick}
            hoverEffect={true}
            className="p-0 border-transparent hover:border-white/10 flex flex-col h-full"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col">
                    <div className="p-6 pb-0">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg ring-1 ring-white/10" style={{ backgroundColor: post.source.color }}>
                            {post.source.icon}
                        </div>
                        <h2 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-glow transition-all">{post.title}</h2>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/5 text-sm text-gray-400 rounded-lg">#{tag}</span>
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{post.date} • {post.readTime}</p>
                    </div>

                    <div className="mx-6 mb-4 p-4 bg-black/40 rounded-2xl border border-white/5 mt-auto">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-200 mb-1">
                                    {post.preview.repo.split('/')[0]}/<span className="font-bold text-white">{post.preview.repo.split('/')[1]}</span>
                                </h3>
                                <p className="text-sm text-gray-500 truncate">{post.preview.description}</p>
                            </div>
                            <img src={post.preview.icon} alt="" className="w-12 h-12 rounded-lg ml-3 bg-white/5" onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${post.preview.repo.split('/')[1]}&background=random`} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z" /></svg>
                                <span className="font-medium">{post.preview.contributors}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /><path d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z" /></svg>
                                <span className="font-medium">{post.preview.issues}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" /></svg>
                                <span className="font-medium">{formatNumber(post.preview.stars)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zm-3 8.75a.75.75 0 10-1.5 0 .75.75 0 001.5 0z" /></svg>
                                <span className="font-medium">{formatNumber(post.preview.forks)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-6 mb-4 h-px bg-white/5 mt-auto" />

                <div className="px-6 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white/5 rounded-xl border border-white/5 p-1">
                            <button onClick={handleUpvote} className={`h-8 flex items-center gap-2 px-3 rounded-lg transition-all ${hasUpvoted ? 'bg-white text-black shadow-glow' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <span className="text-sm font-semibold">{upvotes}</span>
                            </button>
                            <div className="w-px h-4 bg-white/10 mx-1" />
                            <button onClick={handleDownvote} className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${hasDownvoted ? 'text-red-400 bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                        <button onClick={(e) => e.stopPropagation()} className="h-10 px-3 flex items-center gap-2 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            <span className="font-medium text-sm">{post.comments}</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }} className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isSaved ? 'text-black bg-white shadow-glow' : 'text-gray-500 hover:bg-white/10 hover:text-white'}`}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>
                        </button>
                        <button onClick={(e) => e.stopPropagation()} className="h-10 w-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-white/10 hover:text-white transition-all">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 6l-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 2v13" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

// Post Modal
const PostModal = ({ post, onClose }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState(MOCK_COMMENTS);
    const [upvotes, setUpvotes] = useState(post.upvotes);
    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);
    const [isSaved, setIsSaved] = useState(post.saved);
    const [isFollowing, setIsFollowing] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const handleUpvote = () => {
        if (hasUpvoted) { setUpvotes(prev => prev - 1); setHasUpvoted(false); }
        else { setUpvotes(prev => prev + (hasDownvoted ? 2 : 1)); setHasUpvoted(true); setHasDownvoted(false); }
    };

    const handleDownvote = () => {
        if (hasDownvoted) { setUpvotes(prev => prev + 1); setHasDownvoted(false); }
        else { setUpvotes(prev => prev - (hasUpvoted ? 2 : 1)); setHasDownvoted(true); setHasUpvoted(false); }
    };

    const handleComment = () => {
        if (!newComment.trim()) return;
        setComments([{ id: Date.now(), author: { name: "You", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=You", reputation: "1K" }, content: newComment, time: "now", upvotes: 0 }, ...comments]);
        setNewComment('');
    };

    const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
            <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.95 }} className="w-full max-w-5xl glass-panel !bg-[#050505]/90 rounded-3xl shadow-2xl overflow-hidden my-8 mx-4 flex border border-white/10" onClick={e => e.stopPropagation()}>

                {/* Main Content */}
                <div className="flex-1 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Banner */}
                    <div className="px-5 py-3 flex items-center justify-between shadow-lg" style={{ backgroundColor: post.source.color }}>
                        <div className="flex items-center gap-3 text-white">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
                            <span className="text-sm font-medium">Never miss posts from {post.source.name}</span>
                        </div>
                        <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl backdrop-blur-sm">Subscribe</button>
                    </div>

                    {/* Header */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg" style={{ backgroundColor: post.source.color }}>{post.source.icon}</div>
                                <span className="font-medium text-gray-300">{post.source.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href="#" className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-200">
                                    Read post <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
                                </a>
                                <button onClick={onClose} className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-5">
                            <img src={post.author.avatar} alt="" className="w-11 h-11 rounded-full ring-2 ring-white/10" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{post.author.name}</span>
                                    <span className="text-sm text-gray-500">{post.author.handle}</span>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">⚡ {post.author.reputation}</span>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2 leading-tight">{post.title}</h1>
                        <p className="text-sm text-gray-500 mb-5">{post.readTime}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="px-6 pb-4 flex flex-wrap gap-2">
                        <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-xl shadow-glow">✨ TLDR</button>
                        <button className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10">Simplify it</button>
                        <button className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10">Remove fluff</button>
                        <button className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10">Challenge this</button>
                    </div>

                    {/* Content */}
                    <div className="px-6 pb-5">
                        <p className="text-gray-300 leading-relaxed text-lg">{post.content}</p>
                    </div>

                    {/* Tags */}
                    <div className="px-6 pb-5 flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3.5 py-1.5 bg-white/5 border border-white/5 text-sm font-medium text-gray-400 rounded-xl">#{tag}</span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="px-6 py-3 text-sm text-gray-500 border-t border-white/5">
                        <span className="font-bold text-white">{upvotes}</span> Upvotes • <span className="font-bold text-white">{comments.length}</span> Comments
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <button onClick={handleUpvote} className={`p-3 rounded-xl transition-all ${hasUpvoted ? 'bg-white text-black shadow-glow' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                            <button onClick={handleDownvote} className={`p-3 rounded-xl transition-all ${hasDownvoted ? 'bg-white text-black shadow-glow' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 rounded-xl text-sm text-gray-400 hover:text-white transition-all">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg> Comment
                            </button>
                            <button onClick={() => setIsSaved(!isSaved)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${isSaved ? 'bg-white text-black shadow-glow' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg> {isSaved ? 'Saved' : 'Save'}
                            </button>
                            <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 rounded-xl text-sm text-gray-400 hover:text-white transition-all">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                                {copiedLink ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Comment Input */}
                    <div className="px-6 py-5 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=You" alt="" className="w-10 h-10 rounded-full ring-1 ring-white/10" />
                            <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-white/20 focus-within:ring-1 focus-within:ring-white/20">
                                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleComment()} placeholder="Share your thoughts..." className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 px-3 py-2 focus:outline-none" />
                                <button onClick={handleComment} disabled={!newComment.trim()} className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-200 disabled:bg-white/10 disabled:text-gray-500">Post</button>
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="px-6 pb-8 space-y-5">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex gap-4">
                                <img src={comment.author.avatar} alt="" className="w-10 h-10 rounded-full ring-1 ring-white/10" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-white">{comment.author.name}</span>
                                        <span className="text-xs text-gray-500 font-medium">⚡ {comment.author.reputation}</span>
                                        <span className="text-xs text-gray-500">• {comment.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-2">{comment.content}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <button className="hover:text-white transition-colors">{comment.upvotes} upvotes</button>
                                        <button className="hover:text-white transition-colors">Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-80 bg-black/40 border-l border-white/5 p-6 hidden lg:block max-h-[90vh] overflow-y-auto">
                    {/* Source */}
                    <div className="bg-white/5 rounded-2xl p-5 mb-5 border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg" style={{ backgroundColor: post.source.color }}>{post.source.icon}</div>
                            <span className="font-bold text-white">{post.source.name}</span>
                        </div>
                        <button className="w-full py-2.5 text-white font-semibold rounded-xl" style={{ backgroundColor: post.source.color }}>Join Community</button>
                        <p className="text-xs text-gray-500 mt-3 text-center">2.4K Members • 29.7K Upvotes</p>
                    </div>

                    {/* Author */}
                    <div className="bg-white/5 rounded-2xl p-5 mb-5 border border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={post.author.avatar} alt="" className="w-14 h-14 rounded-full ring-2 ring-white/10" />
                            <div>
                                <p className="font-bold text-white">{post.author.name}</p>
                                <p className="text-xs text-gray-400">{post.author.handle}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsFollowing(!isFollowing)} className={`w-full py-2.5 font-semibold rounded-xl transition-all ${isFollowing ? 'bg-white/10 text-white' : 'bg-white text-black shadow-glow'}`}>
                            {isFollowing ? '✓ Following' : 'Follow'}
                        </button>
                        <p className="text-xs text-gray-500 font-medium mt-4">⚡ {post.author.reputation}</p>
                    </div>

                    {/* Share */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                        <p className="text-sm font-semibold text-white mb-4">Share this post</p>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={handleCopyLink} className={`flex items-center justify-center p-3 rounded-xl transition-all ${copiedLink ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                            </button>
                            <button className="flex items-center justify-center p-3 bg-[#25D366] text-white rounded-xl hover:opacity-90">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                            </button>
                            <button className="flex items-center justify-center p-3 bg-[#1877F2] text-white rounded-xl hover:opacity-90">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </button>
                            <button className="flex items-center justify-center p-3 bg-black text-white rounded-xl border border-white/20 hover:bg-gray-900">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Main Page
const Posts = () => {
    const [activeFilter, setActiveFilter] = useState('For You');
    const [selectedPost, setSelectedPost] = useState(null);
    const filters = ['For You', 'Following', 'Popular', 'Recent'];

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-5xl font-light text-white font-display tracking-tight mb-2">Posts</h1>
                        <p className="text-gray-400 text-lg font-light">Discover developer articles and projects</p>
                    </div>
                    <Button variant="primary">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                        New Post
                    </Button>
                </header>

                <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                    {filters.map(filter => (
                        <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeFilter === filter ? 'bg-white text-black shadow-glow' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {POSTS.map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} onClick={() => setSelectedPost(post)} />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default Posts;
