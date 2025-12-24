import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, TRENDING_TAGS, POPULAR_TAGS, RECENT_TAGS, VIDEOS_BY_TOPIC } from '../data/education';

const Education = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const getTopicById = (id) => TOPICS.find(t => t.id === id);
    const videos = selectedTopic ? (VIDEOS_BY_TOPIC[selectedTopic] || []) : [];

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto">

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    {selectedTopic ? (
                        <button
                            onClick={() => setSelectedTopic(null)}
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-4 transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to topics
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-300 text-sm mb-3">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                            Topics
                        </div>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {selectedTopic ? getTopicById(selectedTopic)?.name : 'Education'}
                    </h1>
                    {!selectedTopic && <p className="text-gray-400 mt-1 text-sm">Select a topic to start learning</p>}
                </motion.header>

                {/* Tags View */}
                <AnimatePresence mode="wait">
                    {!selectedTopic && (
                        <motion.div
                            key="tags"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Tag Lists Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Trending */}
                                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Trending</h3>
                                    <div className="space-y-1">
                                        {TRENDING_TAGS.slice(0, 8).map((tagId, i) => {
                                            const topic = getTopicById(tagId);
                                            return (
                                                <motion.button
                                                    key={tagId}
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => setSelectedTopic(tagId)}
                                                    className="w-full flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                                                >
                                                    <span className="w-5 text-xs text-gray-300 font-medium">{i + 1}</span>
                                                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">{topic?.name}</span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Popular */}
                                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Popular</h3>
                                    <div className="space-y-1">
                                        {POPULAR_TAGS.slice(0, 8).map((tagId, i) => {
                                            const topic = getTopicById(tagId);
                                            return (
                                                <motion.button
                                                    key={tagId}
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => setSelectedTopic(tagId)}
                                                    className="w-full flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                                                >
                                                    <span className="w-5 text-xs text-gray-300 font-medium">{i + 1}</span>
                                                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">{topic?.name}</span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent */}
                                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recently Added</h3>
                                    <div className="space-y-1">
                                        {RECENT_TAGS.slice(0, 8).map((tagId, i) => {
                                            const topic = getTopicById(tagId);
                                            return (
                                                <motion.button
                                                    key={tagId}
                                                    whileHover={{ x: 4 }}
                                                    onClick={() => setSelectedTopic(tagId)}
                                                    className="w-full flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                                                >
                                                    <span className="w-5 text-xs text-gray-300 font-medium">{i + 1}</span>
                                                    <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">{topic?.name}</span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* All Tags */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">All Topics</h3>
                                <div className="flex flex-wrap gap-2">
                                    {TOPICS.map((topic, i) => (
                                        <motion.button
                                            key={topic.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.015 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedTopic(topic.id)}
                                            className="px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm rounded-full text-sm text-gray-600 hover:text-gray-900 transition-all"
                                        >
                                            #{topic.name.toLowerCase().replace(/[.\s/]/g, '')}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Cards Grid */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Browse Categories</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {TOPICS.map((topic, i) => (
                                        <motion.button
                                            key={topic.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            whileHover={{ y: -4, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedTopic(topic.id)}
                                            className="relative p-4 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl text-center hover:shadow-lg transition-all overflow-hidden group"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                            <span className="text-2xl mb-2 block">{topic.icon}</span>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{topic.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Videos View */}
                <AnimatePresence mode="wait">
                    {selectedTopic && (
                        <motion.div
                            key="videos"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Topic Banner */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 p-6 bg-white border border-gray-100 rounded-2xl"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getTopicById(selectedTopic)?.color} flex items-center justify-center text-3xl shadow-lg`}>
                                        {getTopicById(selectedTopic)?.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{getTopicById(selectedTopic)?.name}</h2>
                                        <p className="text-gray-400 text-sm mt-0.5">{videos.length} curated videos from top creators</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Videos Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {videos.map((video, index) => (
                                    <motion.div
                                        key={video.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                        whileHover={{ y: -4 }}
                                        onClick={() => setSelectedVideo(video)}
                                        className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                            />
                                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[11px] font-medium rounded">
                                                {video.duration}
                                            </div>
                                            {/* Play Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">
                                                <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all shadow-xl">
                                                    <svg className="w-5 h-5 text-gray-900 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-3.5">
                                            <div className="flex gap-3">
                                                <img
                                                    src={video.channelAvatar}
                                                    alt={video.channel}
                                                    className="w-8 h-8 rounded-full bg-gray-100 shrink-0"
                                                    onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${video.channel}&background=random&size=32`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                        {video.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-xs mt-1.5">{video.channel}</p>
                                                    <p className="text-gray-300 text-xs">{video.views}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {videos.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-400 text-sm">No videos yet for this topic</p>
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close */}
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Video Player */}
                            <div className="aspect-video bg-black">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                                    title={selectedVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Info */}
                            <div className="p-5 border-t border-gray-800">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={selectedVideo.channelAvatar}
                                        alt={selectedVideo.channel}
                                        className="w-10 h-10 rounded-full bg-gray-700"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-white font-semibold text-lg leading-snug">{selectedVideo.title}</h2>
                                        <p className="text-gray-400 text-sm mt-1">{selectedVideo.channel} • {selectedVideo.views}</p>
                                    </div>
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
