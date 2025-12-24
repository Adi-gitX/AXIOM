import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, TRENDING_TAGS, POPULAR_TAGS, VIDEOS_BY_TOPIC } from '../data/education';

// Custom Topic Icons
const TopicIcons = {
    react: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full">
            <circle cx="16" cy="16" r="3.5" fill="currentColor" />
            <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 16 16)" />
            <ellipse cx="16" cy="16" rx="14" ry="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 16 16)" />
        </svg>
    ),
    nodejs: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <path d="M16 2L4 9v14l12 7 12-7V9L16 2zm0 2.2l9.6 5.6v11.2L16 26.6l-9.6-5.6V9.8L16 4.2z" />
            <path d="M16 10v12M10 13l6 3.5M22 13l-6 3.5" />
        </svg>
    ),
    python: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <path d="M15.9 3c-4.8 0-4.5 2.1-4.5 2.1l.01 2.2h4.6v.6H9.3S5 7.5 5 12.4c0 4.9 3.7 4.7 3.7 4.7h2.2v-2.3s-.1-2.2 2.2-2.2h3.8s2.1 0 2.1-2.1V6.1S19.4 3 15.9 3zm-2.6 1.8a.85.85 0 110 1.7.85.85 0 010-1.7z" />
            <path d="M16.1 29c4.8 0 4.5-2.1 4.5-2.1l-.01-2.2h-4.6v-.6h6.71s4.3.3 4.3-4.6c0-4.9-3.7-4.7-3.7-4.7h-2.2v2.3s.1 2.2-2.2 2.2h-3.8s-2.1 0-2.1 2.1v4.4s-.4 3.1 3.1 3.1zm2.6-1.8a.85.85 0 110-1.7.85.85 0 010 1.7z" />
        </svg>
    ),
    javascript: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <rect x="4" y="4" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 22v-8M15 14v8c0 1.5-1 2-2 2M21 14l3 4-3 4M18 14l-3 4 3 4" />
        </svg>
    ),
    typescript: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <rect x="4" y="4" width="24" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 15h7M13.5 15v9M20 15h5M22.5 15v9" />
        </svg>
    ),
    nextjs: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 11v10l10-13M20 21v-6" />
        </svg>
    ),
    'system-design': () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="8" height="8" rx="2" /><rect x="20" y="4" width="8" height="8" rx="2" />
            <rect x="12" y="20" width="8" height="8" rx="2" /><path d="M8 12v4l4 4M24 12v4l-4 4" />
        </svg>
    ),
    dsa: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="16" cy="6" r="3" /><circle cx="8" cy="16" r="3" /><circle cx="24" cy="16" r="3" />
            <circle cx="12" cy="26" r="3" /><circle cx="20" cy="26" r="3" />
            <path d="M16 9v4M13.5 14l-2.5 2M18.5 14l2.5 2M10 19l2 4M22 19l-2 4" />
        </svg>
    ),
    aiml: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="16" cy="16" r="4" /><circle cx="16" cy="6" r="2" /><circle cx="16" cy="26" r="2" />
            <circle cx="6" cy="16" r="2" /><circle cx="26" cy="16" r="2" />
            <circle cx="8" cy="8" r="2" /><circle cx="24" cy="8" r="2" />
            <circle cx="8" cy="24" r="2" /><circle cx="24" cy="24" r="2" />
            <path d="M16 12V8M16 20v4M12 16H8M20 16h4M13 13l-3-3M19 13l3-3M13 19l-3 3M19 19l3 3" />
        </svg>
    ),
    'neural-networks': () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="6" cy="10" r="2.5" /><circle cx="6" cy="22" r="2.5" />
            <circle cx="16" cy="6" r="2.5" /><circle cx="16" cy="16" r="2.5" /><circle cx="16" cy="26" r="2.5" />
            <circle cx="26" cy="10" r="2.5" /><circle cx="26" cy="22" r="2.5" />
            <path d="M8.5 10l5 -3M8.5 10l5 6M8.5 22l5 4M8.5 22l5 -6M18.5 6l5 4M18.5 16l5 -6M18.5 16l5 6M18.5 26l5 -4" />
        </svg>
    ),
    css: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <path d="M6 4l2 22 8 3 8-3 2-22H6zm18.5 6H11l.3 3h12.9l-1 11-7.2 2.5-7.2-2.5-.5-5h3l.2 3 4.5 1.2 4.5-1.2.5-5H10.5l-.8-9h12.8z" />
        </svg>
    ),
    devops: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 4a12 12 0 0112 12h-6a6 6 0 00-6-6V4z" />
            <path d="M28 16a12 12 0 01-12 12v-6a6 6 0 006-6h6z" />
            <path d="M16 28a12 12 0 01-12-12h6a6 6 0 006 6v6z" />
            <path d="M4 16a12 12 0 0112-12v6a6 6 0 00-6 6H4z" />
        </svg>
    ),
    docker: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <path d="M17 10h3v3h-3zM13 10h3v3h-3zM9 10h3v3h-3zM13 6h3v3h-3zM17 6h3v3h-3zM21 6h3v3h-3zM5 10h3v3H5zM9 6h3v3H9z" />
            <path d="M30 13.5c-.8-.5-2.5-.7-3.8-.4-.3-1.5-1.3-2.8-2.6-3.6l-.5-.3-.3.5c-.6 1-1 2.2-.9 3.3 0 .5.1 1.1.4 1.6-.7.4-1.5.6-2.2.7H2.2l-.1.7c-.1 1.5.1 3 .6 4.5.6 1.6 1.6 2.9 2.9 3.8 1.4 1 3.4 1.5 5.7 1.5 1.1 0 2.2-.1 3.2-.3 1.4-.3 2.8-.8 4-1.5 1-.6 1.9-1.3 2.7-2.2 1.3-1.4 2.1-3 2.6-4.7h.2c1.2 0 2-.3 2.5-.6.3-.2.5-.3.7-.5l.2-.2-.5-.3z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
    ),
    kubernetes: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="16" cy="16" r="12" />
            <path d="M16 4v24M4 16h24M7 7l18 18M25 7L7 25" />
            <circle cx="16" cy="16" r="4" />
        </svg>
    ),
    aws: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 20c2-1 6-2 12-2s10 1 12 2M7 16l3 6 3-8 3 8 3-6M22 14l4 8" />
            <path d="M16 6l10 6v10l-10 6-10-6V12l10-6z" />
        </svg>
    ),
    database: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <ellipse cx="16" cy="8" rx="10" ry="4" />
            <path d="M6 8v16c0 2.2 4.5 4 10 4s10-1.8 10-4V8" />
            <path d="M6 14c0 2.2 4.5 4 10 4s10-1.8 10-4" />
            <path d="M6 20c0 2.2 4.5 4 10 4s10-1.8 10-4" />
        </svg>
    ),
    golang: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="currentColor">
            <ellipse cx="16" cy="18" rx="10" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="15" r="1.5" /><circle cx="20" cy="15" r="1.5" />
            <path d="M12 20c2 2 6 2 8 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    ),
    rust: () => (
        <svg viewBox="0 0 32 32" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="16" cy="16" r="10" />
            <path d="M16 6v2M16 24v2M6 16h2M24 16h2M8.93 8.93l1.41 1.41M21.66 21.66l1.41 1.41M8.93 23.07l1.41-1.41M21.66 10.34l1.41-1.41" />
            <circle cx="16" cy="16" r="4" />
        </svg>
    ),
};

const getIcon = (topicId) => TopicIcons[topicId] || (() => <div className="w-full h-full rounded-full bg-current opacity-50" />);

// Gradient colors for topics
const gradients = {
    react: 'from-sky-400 to-blue-600',
    nodejs: 'from-green-400 to-emerald-600',
    python: 'from-yellow-400 to-amber-600',
    javascript: 'from-yellow-300 to-orange-500',
    typescript: 'from-blue-400 to-indigo-600',
    nextjs: 'from-gray-600 to-gray-900',
    'system-design': 'from-violet-400 to-purple-600',
    dsa: 'from-rose-400 to-pink-600',
    aiml: 'from-purple-400 to-violet-600',
    'neural-networks': 'from-fuchsia-400 to-pink-600',
    css: 'from-blue-400 to-cyan-500',
    devops: 'from-orange-400 to-red-600',
    docker: 'from-blue-400 to-cyan-600',
    kubernetes: 'from-blue-500 to-indigo-700',
    aws: 'from-orange-400 to-amber-600',
    database: 'from-emerald-400 to-teal-600',
    golang: 'from-cyan-400 to-teal-600',
    rust: 'from-orange-500 to-red-700',
};

const Education = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [view, setView] = useState('grid'); // 'grid' | 'list'

    const getTopicById = (id) => TOPICS.find(t => t.id === id);
    const videos = selectedTopic ? (VIDEOS_BY_TOPIC[selectedTopic] || []) : [];
    const Icon = selectedTopic ? getIcon(selectedTopic) : null;

    return (
        <div className="min-h-screen p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-[1440px] mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    {selectedTopic ? (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => setSelectedTopic(null)}
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-4 group transition-colors"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-sm font-medium">All Topics</span>
                        </motion.button>
                    ) : null}

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                {selectedTopic ? (
                                    <span className="flex items-center gap-4">
                                        <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[selectedTopic]} text-white p-2.5 shadow-lg`}>
                                            {Icon && <Icon />}
                                        </span>
                                        {getTopicById(selectedTopic)?.name}
                                    </span>
                                ) : 'Learn'}
                            </h1>
                            <p className="text-gray-400 mt-2">
                                {selectedTopic ? `${videos.length} curated tutorials` : 'Master any technology with curated content'}
                            </p>
                        </div>
                        {!selectedTopic && (
                            <div className="hidden md:flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </motion.header>

                {/* Topics View */}
                <AnimatePresence mode="wait">
                    {!selectedTopic && (
                        <motion.div
                            key="topics"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-10"
                        >
                            {/* Featured Topics */}
                            <section>
                                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-5">Featured</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {TRENDING_TAGS.slice(0, 5).map((id, i) => {
                                        const topic = getTopicById(id);
                                        const Icon = getIcon(id);
                                        return (
                                            <motion.button
                                                key={id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                whileHover={{ y: -6, scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedTopic(id)}
                                                className={`relative p-6 rounded-3xl bg-gradient-to-br ${gradients[id]} text-white overflow-hidden group shadow-lg hover:shadow-2xl transition-all`}
                                            >
                                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                                                <div className="w-10 h-10 mb-4 opacity-90">
                                                    <Icon />
                                                </div>
                                                <h3 className="font-bold text-lg">{topic?.name}</h3>
                                                <p className="text-white/70 text-xs mt-1">{VIDEOS_BY_TOPIC[id]?.length || 0} videos</p>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* All Topics Grid */}
                            <section>
                                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-5">All Topics</h2>
                                <div className={view === 'grid'
                                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
                                    : "space-y-2"
                                }>
                                    {TOPICS.map((topic, i) => {
                                        const Icon = getIcon(topic.id);
                                        return view === 'grid' ? (
                                            <motion.button
                                                key={topic.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.02 }}
                                                whileHover={{ y: -4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedTopic(topic.id)}
                                                className="p-4 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl text-center hover:shadow-lg transition-all group"
                                            >
                                                <div className={`w-10 h-10 mx-auto mb-3 rounded-xl bg-gradient-to-br ${gradients[topic.id]} text-white p-2 group-hover:scale-110 transition-transform shadow-md`}>
                                                    <Icon />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                key={topic.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.02 }}
                                                whileHover={{ x: 4 }}
                                                onClick={() => setSelectedTopic(topic.id)}
                                                className="w-full flex items-center gap-4 p-3 bg-white border border-gray-100 hover:border-gray-200 rounded-xl hover:shadow-md transition-all group"
                                            >
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[topic.id]} text-white p-2 shadow-md`}>
                                                    <Icon />
                                                </div>
                                                <span className="font-medium text-gray-700">{topic.name}</span>
                                                <span className="ml-auto text-xs text-gray-400">{VIDEOS_BY_TOPIC[topic.id]?.length || 0} videos</span>
                                                <svg className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 18l6-6-6-6" />
                                                </svg>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Videos View */}
                <AnimatePresence mode="wait">
                    {selectedTopic && (
                        <motion.div
                            key="videos"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {videos.map((video, index) => (
                                    <motion.div
                                        key={video.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -6 }}
                                        onClick={() => setSelectedVideo(video)}
                                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all cursor-pointer group"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded-md backdrop-blur-sm">
                                                {video.duration}
                                            </div>
                                            {/* Play Button */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-2xl">
                                                    <svg className="w-6 h-6 text-gray-900 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <div className="flex gap-3">
                                                <img
                                                    src={video.channelAvatar}
                                                    alt=""
                                                    className="w-9 h-9 rounded-full bg-gray-100 shrink-0"
                                                    onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${video.channel}&background=random&size=36`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {video.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-xs mt-2">{video.channel}</p>
                                                    <p className="text-gray-300 text-xs">{video.views}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {videos.length === 0 && (
                                <div className="text-center py-24">
                                    <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${gradients[selectedTopic]} text-white p-5 opacity-50`}>
                                        {Icon && <Icon />}
                                    </div>
                                    <p className="text-gray-400">Coming soon</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="w-full max-w-6xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-50 p-3 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Video */}
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                                    title={selectedVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Info */}
                            <div className="mt-6 flex items-start gap-4">
                                <img
                                    src={selectedVideo.channelAvatar}
                                    alt=""
                                    className="w-12 h-12 rounded-full bg-gray-700"
                                />
                                <div>
                                    <h2 className="text-white text-xl font-semibold">{selectedVideo.title}</h2>
                                    <p className="text-gray-400 mt-1">{selectedVideo.channel} • {selectedVideo.views}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Education;
