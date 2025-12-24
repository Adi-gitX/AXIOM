import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, VIDEOS_BY_TOPIC } from '../data/education';

const Education = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [hoveredTopic, setHoveredTopic] = useState(null);

    const getTopicById = (id) => TOPICS.find(t => t.id === id);
    const videos = selectedTopic ? (VIDEOS_BY_TOPIC[selectedTopic] || []) : [];

    return (
        <div className="min-h-screen p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">

                {/* Minimal Header */}
                <motion.header
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-16"
                >
                    {selectedTopic ? (
                        <div className="flex items-center gap-6">
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setSelectedTopic(null)}
                                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </motion.button>
                            <div>
                                <h1 className="text-4xl font-light text-gray-900 tracking-tight">{getTopicById(selectedTopic)?.name}</h1>
                                <p className="text-gray-400 text-sm mt-2">{videos.length} videos</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-5xl font-light text-gray-900 tracking-tight">Education</h1>
                            <p className="text-gray-400 mt-3">Choose what to learn</p>
                        </div>
                    )}
                </motion.header>

                {/* Topics Grid */}
                <AnimatePresence mode="wait">
                    {!selectedTopic && (
                        <motion.div
                            key="topics"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden">
                                {TOPICS.map((topic, i) => (
                                    <motion.button
                                        key={topic.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        onClick={() => setSelectedTopic(topic.id)}
                                        onMouseEnter={() => setHoveredTopic(topic.id)}
                                        onMouseLeave={() => setHoveredTopic(null)}
                                        className="relative bg-white p-8 text-left transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="text-xs text-gray-300 font-mono">{String(i + 1).padStart(2, '0')}</span>
                                                <h3 className="text-xl font-medium text-gray-900 mt-3 group-hover:text-gray-600 transition-colors">
                                                    {topic.name}
                                                </h3>
                                                <p className="text-sm text-gray-400 mt-2">
                                                    {VIDEOS_BY_TOPIC[topic.id]?.length || 0} tutorials
                                                </p>
                                            </div>
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    x: hoveredTopic === topic.id ? 0 : 10,
                                                    opacity: hoveredTopic === topic.id ? 1 : 0
                                                }}
                                                className="text-gray-400"
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </motion.div>
                                        </div>

                                        {/* Hover line */}
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                scaleX: hoveredTopic === topic.id ? 1 : 0,
                                            }}
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 origin-left"
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Videos */}
                <AnimatePresence mode="wait">
                    {selectedTopic && (
                        <motion.div
                            key="videos"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="space-y-4">
                                {videos.map((video, index) => (
                                    <motion.div
                                        key={video.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedVideo(video)}
                                        className="group flex gap-6 p-4 -mx-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-72 shrink-0 aspect-video bg-gray-100 rounded-xl overflow-hidden">
                                            <img
                                                src={video.thumbnail}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                                            />
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-900/90 text-white text-xs font-medium rounded">
                                                {video.duration}
                                            </div>
                                            {/* Play */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl">
                                                    <svg className="w-6 h-6 text-gray-900 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 py-2">
                                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                                                {video.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-4">
                                                <img
                                                    src={video.channelAvatar}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full bg-gray-100"
                                                    onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${video.channel}&background=f3f4f6&color=9ca3af&size=32`}
                                                />
                                                <div>
                                                    <p className="text-sm text-gray-600">{video.channel}</p>
                                                    <p className="text-xs text-gray-400">{video.views}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="self-center text-gray-300 group-hover:text-gray-400 transition-colors">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {videos.length === 0 && (
                                <div className="text-center py-32">
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
                        className="fixed inset-0 z-50 bg-gray-950"
                        onClick={() => setSelectedVideo(null)}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="h-full flex flex-col items-center justify-center p-8" onClick={(e) => e.stopPropagation()}>
                            {/* Video */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden"
                            >
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                                    title={selectedVideo.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </motion.div>

                            {/* Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mt-8 text-center"
                            >
                                <h2 className="text-white text-xl font-light">{selectedVideo.title}</h2>
                                <p className="text-white/50 text-sm mt-2">{selectedVideo.channel} · {selectedVideo.views}</p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Education;
