import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Zap, Play } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import { VIDEOS, CATEGORIES } from '../data/education';

const Education = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredVideos = VIDEOS.filter(v => {
        const matchesCategory = activeCategory === "All" || v.category === activeCategory;
        const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.channel.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* Header */}
                <header>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight font-display mb-2">
                        Education Hub
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl">
                        Curated video courses on System Design, DSA, Operating Systems, and more
                    </p>
                </header>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    {/* Categories */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeCategory === category
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search courses..."
                            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    <AnimatePresence mode="popLayout">
                        {filteredVideos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <VideoCard
                                    video={video}
                                    onClick={setSelectedVideo}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {filteredVideos.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <Search size={24} className="text-gray-300" />
                            </div>
                            <p className="text-gray-500">No courses found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/70 backdrop-blur-sm"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Video */}
                            <div className="aspect-video bg-black relative">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${selectedVideo.youtubeId || 'dQw4w9WgXcQ'}?autoplay=1`}
                                    title="Video Player"
                                    frameBorder="0"
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="p-6 flex items-start gap-4">
                                <img src={selectedVideo.channelAvatar} className="w-12 h-12 rounded-full object-cover bg-gray-100" alt="" />
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h2>
                                    <p className="text-gray-500 text-sm mt-1">{selectedVideo.channel} • {selectedVideo.views} views</p>
                                </div>
                                <button className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
                                    <Zap size={14} /> Quiz
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Education;
